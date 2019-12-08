---
title: "Introducing charlieegan3/infrastructure"
date: 2019-12-08 05:53:39 +0100
---

Since starting at Jetstack I've spent much time building a personal Kubernetes
cluster to run my various side projects. I no longer run anything on Heroku,
Lamdba, App Engine or Netlify. With Ingress, Cronjobs and Knative I'm able to
replicate all the features of these platforms I valued on Kubernetes.

Having a single platform has really reduced the time involved in deploying side
projects. I'm a big fan of side projects being more than a GitHub repo - part of
the fun is making a usable thing or something I can use. Scale to zero really
helps pack things in here - something I've been making much more use of recently
([borked](https://github.com/charlieegan3/borked),
[mycriticmatch](https://github.com/charlieegan3/mycriticmatch),
[rssmerge](https://github.com/charlieegan3/rssmerge),
[xmas-trees](https://github.com/charlieegan3/policing-christmas-trees) and
various other personal tools run on Knative and scale to zero).

This post was mostly just to introduce this repo:
[charlieegan3/infrastructure](https://github.com/charlieegan3/infrastructure)

I had to spend quite a bit of time getting all the secrets out of the repo. I
took the opportunity to deploy [vault](https://www.vaultproject.io/) and [GKE
workload
identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity)
rather than use something like [gitcrypt](https://github.com/AGWA/git-crypt) or
[sealed secrets](https://github.com/bitnami-labs/sealed-secrets). In the end
this was more of a tongue twister than anything particularly good but I do
appreciate how transparent the public repo can be.

In the repo there are two 'projects',GCP & K8s. GCP is a relatively simple
Terraform stack to deploy a GKE cluster, DNS configuration, object storage
resources, KMS etc. K8s is a collection of folders, on for each namespace in the
cluster (which map approximately to side projects). Most of these are raw YAMLs
but there are also some of my (signature?) Docker Helm template projects too.

I was keen to make this public so it was easier to share my config more easily
with others - in particular with customers while working on site.
