---
aliases:
- /blog/2018/08/15/cheap-gke-cluster-zero-loadbalancers
title: "Running a cheap GKE cluster with public ingress & zero load balancers"
date: 2018-08-15 21:53:39 +0100
---

Joining Jetstack earlier this year finally convinced me that I needed a
side-project cluster. All the cool kids had one and I wanted one too.

I didn't want to spend any money though, or at least I wanted to do this on the
cheap. I also didn't want to run a real node in my flat.

What I really wanted was a GKE cluster. I needed to just focus on getting things
running. Eventually, I want to run all my side-projects on Kubernetes - 5
year plan!

There were some problems with the money though. I was doing this on the cheap.

I could get nodes on Digital Ocean really cheap. I also liked the idea of running
a cluster on Scaleway. I just didn't really want to deal with the actual
managing the cluster - hmm.

I looked into the [Single Node Kubernetes Cluster](https://github.com/kelseyhightower/kubeadm-single-node-cluster)
guides a bit. I tried the one for [Digtal Ocean](https://github.com/julianvmodesto/kubeadm-single-node-cluster-digitalocean).

I didn't want to bother with the upgrades & faff. In the end I came
up with a better idea.

One of the main reasons I'd been avoiding using GKE was the load balancer
pricing. I was down to get setup with a single node cluster on there - I just
didn't want a load balancer (I didn't want the cost of running one for my
ingress controller service).

I don't have remotely enough traffic to my side projects to even come close to
_needing_ a load balancer and I only have one node anyway... At the same time I
wanted public ingress - obvs.

Then I had my idea. Why not give my free-tier f1-micro a static IP and have it
run my ingress controller? Taint it stop other pods running there and run
everything else on a preemptible node?

Happy to take the (pretty short) downtime hit each day, this is what I went for.

Here's how it's setup in Terraform. Note the 'ingress' node pool, machine type &
taints.

```hcl
resource "google_container_cluster" "main" {
  name = "main"
  zone = "${var.cluster_zone}"

  lifecycle {
    ignore_changes = ["node_pool"]
  }

  node_pool {
    name = "default-pool"
  }
}

resource "google_container_node_pool" "ingress" {
  name       = "ingress"
  zone       = "${var.cluster_zone}"
  cluster    = "${google_container_cluster.main.name}"
  node_count = 1

  management = {
    auto_repair  = true
    auto_upgrade = false
  }

  node_config {
    preemptible  = false
    machine_type = "f1-micro"
    disk_size_gb = 20

    taint = {
      key    = "ingress"
      value  = "true"
      effect = "NO_EXECUTE"
    }

    labels = {
      ingress = "true"
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}

resource "google_container_node_pool" "main" {
  name       = "main"
  zone       = "${var.cluster_zone}"
  cluster    = "${google_container_cluster.main.name}"
  node_count = 1

  management = {
    auto_repair  = true
    auto_upgrade = true
  }

  node_config {
    preemptible  = true
    machine_type = "n1-standard-2"

    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}
```

There is one more thing - that static IP.

I created a static IP ([see
here](https://cloud.google.com/network-tiers/docs/using-network-service-tiers#creating_static_external_addresses))
and manually edited the network interfaces on the f1-micro vm in GCE :O

Don't judge, I wasn't able to find a way to do this in Terraform and figured
this was 'good enough' for a side project cluster.

Finally, I needed to make sure that the ingress controller landed on that node.
Here's a simplified snippet from my ingress controller deployment. Note the
tolerations and nodeSelector.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: ingress-nginx
spec:
  template:
    spec:
      tolerations:
      - key: ingress
        value: "true"
        effect: NoExecute
      nodeSelector:
        ingress: "true"
...
```

Finally finally, I point my DNS at the static IP and I'm done.

```
$ dig cluster.charlieegan3.com

...

;; ANSWER SECTION:
cluster.charlieegan3.com. 300   IN      A       35.197.243.26
```

So there you have it. If I need to run more stuff I can just use a bigger
preemptible node or add another. They're cheap enough for me at the moment and
worth it for the convenience of GKE - imo.
