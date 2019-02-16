---
aliases:
- /blog/2017/07/16/host-a-static-website-5-minutes
title: "Terraform adventures: Host a static website ~5 minutes"
date: 2017-07-16 14:47:53 +0100
featured: 4
thumbnail: /posts/2017-07-16-host-a-static-website-5-minutes/misleading.jpg
---

![Host a static site](/posts/2017-07-16-host-a-static-website-5-minutes/misleading.jpg)

I was in the market for a project to spend some more time with Terraform when I
saw this prompt in the AWS console. Terraform can do all those things & I have
a static site (this site) that I could use to test it out. As usual, it took a
little longer than expected. This post is a list of mistakes I made and
problems encountered.

## Bucket URLs

As far as I can tell there are up to three URLs for a given bucket:

```
s3.amazonaws.com/BUCKET_NAME
BUCKET_NAME.s3.amazonaws.com
BUCKET_NAME.s3-website-REGION.amazonaws.com
```

The difference between the final two forms confused me - only the s3-website
endpoint will perform static hosting features such as redirects but the `.s3.`
endpoints (bucket domain name) still return files with the correct content
types. In Terraform you're after the `website_endpoint` rather than the
`bucket_domain_name`.

## Subdomain Redirects

(`*` Sorry, the 'to-or-not-to redirect www to the apex domain' debate is out of
scope!)

There is an S3 website hosting feature to redirect all requests to another
hostname. The bucket will return a redirect status.

This seemed ideal - point my `www` subdomain to a bucket in Route53 and have it
redirect everything to the apex domain.

I had this all wired up with an Alias record pointing to the redirect bucket's
s3-website endpoint. Sadly this doesn't work. Turns out that since the website
endpoints don't serve certificates other than those for the S3 `amazonaws.com`
subdomains. This means that _HTTPS_ redirects don't work.

Instead - you need to create an separate Cloudfront distribution for the
redirect bucket. I had an ACM certificate for both domains and had this served
by the redirect Cloudfront distribution as well as the main site distribution.
This isn't really ideal but it does work.

## ACM region
I was able to request ACM certificates in various regions for my domains
(charlieegan3.com & www.charlieegan3.com) via the UI. For some reason;
Terraform was only able to find certificates in `us-east-1`. I wasn't able to
point it at any other region. I requested a new certificate in that region and
actually moved the project default to that region too for the sake of
simplicity.

## All I want is a redirect

This is the fun bit. Imagine you have the following files in your static site:

```
/index.html
/subdir/index.html
```

Now imagine that you'd like to have the following paths and redirects:

```
/
/subdir

/index.html        -> /
/subdir.html       -> /subdir
/subdir/index.html -> /subdir
/subdir/           -> /subdir
```

This is actually a bit of a fiddle to set up in S3.

First to the get `/` path you need to tell S3 that `/index.html` is your index
document. Easy, this can be done in Terraform bucket config.

Getting the `/subdir/` path is also easy as it works by default with S3 static
web hosting enabled. `/subdir` without the trailing slash is harder - to get
this you need to create a file called `subdir` with an HTML content type. I use
the AWS CLI to do this in my deploy script:

```
aws s3 cp s3://#{S3_BUCKET}/subdir/index.html s3://#{S3_BUCKET}/subdir --content-type text/html
```

Unlike Unix, in S3 it's possible to have a file and a folder with in the same
'directory' with the same name.

To get `/subdir/index.html` to redirect to `/subdir` (our new file) we need to
set a property (`website-redirect-location`) on the 'file'.

```
aws s3api copy-object --bucket #{S3_BUCKET} --copy-source #{S3_BUCKET}/subdir/index.html --key /subdir/index.html --website-redirect-location /subdir
```

Still a little way to go yet. Next up: `/subdir.html -> subdir`. This one's
pretty similar, spot the difference in `--key`:

```
aws s3api copy-object --bucket #{S3_BUCKET} --copy-source #{S3_BUCKET}/subdir/index.html --key /subdir.html --website-redirect-location /subdir
```

The following redirections remain:

```
/index.html -> /
/subdir/    -> /subdir
```

**Warning:** If you don't like the sound of Javascript 'redirects' stop here.

You can't set a website-redirect-location on `index.html` since it'll created a
redirect loop back to itself when it's served on `/`. In my JS I'm checking the
path and cleaning it up as required.

Using the same mega hack; I'm stripping trailing '/'s from not root paths.

```js
if (path === "/index.html") {
  window.location = "/"
} else if (path.length > 1 && path.slice(-1) === "/") {
  window.location = path.substring(0, path.length - 1);
}
```

_Disclaimer:_ Some of these redirects can be configured using the bucket redirect
config. I opted to use object properties since the bucket list is limited to 50
rules which is less than I required.

## Terraform Chicken & Egg

I also ran into an issue when provisioning the site from scratch. The redirect
Cloudfront distribution wouldn't create because the 'origin' was down. The
redirect bucket had been created but since it redirected to my domain, and the
other distribution for the apex domain wasn't yet active, it failed.

I just ran parts of the Terraform config in different orders but I wonder if
I might be able to create a tag on the redirect distribution with the apex
Cloudfront distribution ARN to make sure it works out the order correctly. One
for another day.

<hr/>

So that's how to 'Host a static website ~1 weekend'. I'm not sure how to do
it in 5 mins yet.

I've yet to move this under charlieegan3.com (currently it's on
charlieegan.com) while I test it out. Currently
'production' is running for free on App Engine so I'm interested to compare the
costs before switching.  Renewing Lets Encrypt on GAE is a pain so this
solution with ACM is likely to win anyway. CDN's are also 'cool'.
