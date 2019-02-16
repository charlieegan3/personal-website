---
aliases:
- /blog/2018/09/01/gollum-wiki-on-kubernetes
title: Running a wiki with Gollum on Kubernetes
date: 2018-09-01 18:20:12 +0100
thumbnail: /posts/2018-09-01-gollum-wiki-on-kubernetes/patrick-tomasso-71909-unsplash.jpg
---

I've long been
[searching](/blog/2017/01/12/heroku-treasure) for a
good, self-hosted, personal wiki. I went as far to build my own with client-side
encryption running on Heroku as a Rails app. I guess this was version 1. This
post is about version 2.

### Why

**Why was version 1 not good enough?**

- It ran on the free tier of Heroku and had to boot for 10 seconds whenever I
  needed to use it, this was a pain as my use was quite infrequent.
- I didn't want to pay $7 a month to keep it running full time.
- The client side encryption method I'd built using SJCL was cool but clunky. All
  the decryption needed to happen on the client, this made exporting data in
  bulk harder than I'd expected.
- The decryption key was also stored in local storage which seemed to get
  cleared out more regularly than I'd expected.

**Why even do this at all?**

I'm moving all my side-projects to Kubernetes. Some deets on my cluster [here](/posts/2018-08-15-cheap-gke-cluster-zero-loadbalancers).

**Why not run version 1 on Kubernetes then?**

I didn't want to run the database for it in-cluster. Some of the information in
the wiki I'm really keen to keep. I want to store the wiki in git.

# What

While looking for a git based wiki, I came across
[gollum](https://github.com/gollum/gollum). gollum is a ruby gem that runs a
local server that interacts with the git index to both serve and store content.
I liked it and decided to experiment with getting it running. There were some
additional requirements:

- This needs to be stored encrypted
- Only I should have access.

These pose some problems. Before, if I'd needed files to be encrypted in git,
I'd used [git-crypt](https://github.com/AGWA/git-crypt). git-crypt is easy to
use, you add GPG keys, specify files to be encrypted in a `.gitattributes` file
and that's it really. Sadly, it's not possible to use this on a repo with
gollum. gollum reads files to show them on wiki pages and forms _from the git
index_ - not the local file system. With git-crypt, the files are stored in the
index encrypted. I needed something else.

Enter, [`git-remote-gcrypt`](https://github.com/spwhitton/git-remote-gcrypt).
This is a package that adds some functionality to git. It is invoked
automatically with a URI prefix in a git remote:

```
gcrypt::https://example.com/user/repo.git
```

As opposed to:

```
https://example.com/user/repo.git
```

Rather than individual files being encrypted in the index as they are with
git-crypt, the entire git index is encrypted when interacting with the remote.

This means that the local copy of the git index is clear and can be read by
gollum - hooray!

The only other feature I needed to replicate in the new version was
authorization. I needed to make sure that only I was able to read and update the
wiki. gollum is designed to be run as a local server in a local repo so doesn't
have any features for this out of the box. I wanted to have access to it from my
other devices too.

I decided to solve this with the [bit.ly oauth2 proxy](https://github.com/bitly/oauth2_proxy).
It's possible to configure nginx running as an ingress controller to use the
oauth2_proxy for certain backends. This is easily configured with the
[following guide](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/auth/oauth-external-auth/README.md).

With this setup, I had a means of only allowing traffic into the service that
passed my oauth check (to have my email).

## 'gollum-server'

I should also explain how this all fits together and works with gollum running
in a container. There's a tricky bit and it's to do with GPG...

This is the Dockerfile for the service, pretty harmless right?

```
FROM ruby:2.4

RUN apt-get remove gnupg -y
RUN apt-get update && apt-get install -y gnupg2 git-remote-gcrypt vim expect

RUN gem install gollum -v 4.1.2

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD []
```

What about that entrypoint though? Not so much. What does this container need to
do?

1. Download the wiki
1. Decrypt the wiki
1. Serve the wiki
1. Push updates made by gollum to back to the wiki's repo

I'll break it down.

1. Configure the container's git installation:

	Note that we're settings some flags for gcrypt here too. I learned what to
	set here from [this page](http://git-annex.branchable.com/tips/fully_encrypted_git_repositories_with_gcrypt/) - I think...

	```bash
	git config --global user.email "wiki@example.com"
	git config --global user.name "Wiki Robot"

	git config --global --add gcrypt.publish-participants true
	git config --global --add gcrypt.participants $GPG_KEY_ID
	git config --global user.signingkey $GPG_KEY_ID
	git config --global commit.gpgsign true
	```

1. Save the credentials to download the repo from GitHub:

	These are stored as a secret in Kubernetes and available as environment
	variables.

	```bash
	mkdir -p ~/.ssh
	echo $SSH_PUBLIC > ~/.ssh/id_rsa.pub
	echo $SSH_PRIVATE | awk '{gsub(/\\n/,"\n")}1' > ~/.ssh/id_rsa
	echo $GITHUB_COM_KEY > ~/.ssh/known_hosts
	chmod 0400 ~/.ssh/*
	```

1. Do the same for GPG and configure it.

	I set the cache-ttl to be long so that I only need to do the pinentry once.
	GPG pinentry is a major pain & the hardest part about making this while
	project work.

	```bash
	mkdir ~/.gpg
	echo $GPG_PUBLIC | awk '{gsub(/\\n/,"\n")}1' | base64 -d > ~/.gpg/public.key
	echo $GPG_PRIVATE | awk '{gsub(/\\n/,"\n")}1' | base64 -d > ~/.gpg/private.key
	gpg --pinentry-mode loopback --passphrase="$GPG_PASSPHRASE" --import ~/.gpg/*.key

	echo "pinentry-mode loopback" >> ~/.gnupg/gpg.conf
	echo "pinentry-mode loopback" >> ~/.gnupg/gpg-agent.conf
	echo "default-cache-ttl 34560000" >> ~/.gnupg/gpg-agent.conf
	echo "maximum-cache-ttl 34560000" >> ~/.gnupg/gpg-agent.conf
	echo "max-cache-ttl 34560000" >> ~/.gnupg/gpg-agent.conf
	gpg-connect-agent reloadagent /bye
	```

1. Create a passphrase expect script to handle the first and only GPG prompt:

	```bash
	cat > /usr/local/bin/passphrase <<EOF
	#!/usr/bin/expect

	set timeout 60
	set command [lindex \$argv 0]

	eval spawn "\$command"
	expect "Enter passphrase:" { send -- "$GPG_PASSPHRASE\n" }
	expect eof
	EOF

	chmod +x /usr/local/bin/passphrase
	```

1. Use this massive, great, whopping HACK to clone the repo from GitHub:

	Since we set a high ttl, we aren't prompted on future operations with GPG,
	thank _god_.

	```bash
	passphrase "git clone $REPO_REMOTE site" && cd site
	```

Finally the entrypoint starts gollum with our 'pyramid of doom' custom config:

```ruby
#!/usr/bin/env ruby
require 'fileutils'
require 'gollum/app'

wiki = Gollum::Wiki.new(".")

Thread.new do
  loop do
    sleep 3
    if File.exists?("sync")
      if system("git pull origin master")
        if system("git push origin master")
          content = File.read("Home.md").gsub(/^Updated:.*/, "Updated: #{Time.new}")
          File.write("Home.md", content)
          system("git add Home.md; git commit -m update")

          File.delete("sync")
        end
      end
    end
  end
end

# Per https://github.com/gollum/gollum-lib/issues/12
Gollum::Hook.register(:post_commit, :hook_id) do |committer, sha1|
  FileUtils.touch("sync")
end
```

This a little more complex than it needs to be really, but I wanted to have some
kind of acknowledgement that the wiki had update in the gollum interface. The
easiest way to get this working was writing a timestamp to the homepage. Yeah,
yeah...

I run the updates to git in another ruby thread to keep the wiki responsive.

### Deploy that thang

The deployment is really boring. Just run the container with some secrets
available.

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: wiki
  labels:
    app: wiki
  namespace: wiki
spec:
  replicas: 1
  selector:
    matchLabels:
      app: wiki
  template:
    metadata:
      labels:
        app: wiki
    spec:
      containers:
      - name: web
        image: charlieegan3/wiki:1e6007ff832f6afaa7c2b15e1044f907
        args: ["make", "server"]
        envFrom:
        - secretRef:
            name: wiki-config
        ports:
        - containerPort: 4567
        resources:
          limits:
            cpu: "100m"
            memory: "100Mi"
          requests:
            cpu: "100m"
            memory: "100Mi"
```

`make server` just runs `gollum -c config.rb` which starts the gollum server
with our config above.

The ingress is a little more interesting, we can see the annotations for the
oauth proxy:

```
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: wiki
  namespace: wiki
  labels:
    app: wiki
  annotations:
    certmanager.k8s.io/cluster-issuer: "letsencrypt-prod"
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/auth-url: "https://subdomain.example.com.com/oauth2/auth"
    nginx.ingress.kubernetes.io/auth-signin: "https://subdomain.example.com/oauth2/start?rd=https%3A%2F%2Fsubdomain.example.com"
spec:
  tls:
  - hosts:
    - subdomain.example.com
    secretName: wiki-tls
  rules:
  - host: subdomain.example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: wiki
          servicePort: 80
```

### Conclusion

It works - just about.

This gives me a wiki that only I can access, that's encrypted and available on
all my devices. I didn't even need to build the interface #winning.

(but wow, GPG UI so hard...)

***

_Tumbnail by Patrick Tomasso on Unsplash_
