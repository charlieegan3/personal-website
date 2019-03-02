---
title: "Running a cheap GKE cluster: Revisted"
date: 2019-03-02 20:30:39 +0000
---

Last year I wrote a
[post](/posts/2018-08-15-cheap-gke-cluster-zero-loadbalancers/) about how I run
my personal cluster in a cost-effective way on GKE. I've since been able to
automate the main manual step and thought I'd post a short update.

## Recap

This is what I used to do:

1. Deploy cluster with Terraform
1. Connect a reserved static IP manually to the single node in the ingress node
   pool where NGINX runs.
1. Update the `externalIPs` of the NGINX ingress controller service to the
   internal IP of the node.

This has two manual steps and they caused some pain recently.

## V2

I knew I could use `hostNetwork: true` on the NGINX deployment instead (I'm just
running a single pod - personal cluster etc.). So that'd save the pain of
updating the internal IP.

I needed a solution for the external IP though where I point
`*.charlieegan3.com`. I did some digging and came across
[kubeip](https://github.com/doitintl/kubeip).

kubeip's intended use is for assigning static IPs from a pool to nodes in a GKE
cluster so traffic comes from a known set of IPs. This isn't what I'm trying to
do but it works for me, I have one IP and want to assign it to nodes in my
ingress node pool of size 1.

With this running in the cluster it watches for instances in the given pool
without a label and assigns a labeled IP addresses to the node.

<hr>

So that's it really - just a short update on how I made my cluster slightly
easier to run. No load balancers needed!
