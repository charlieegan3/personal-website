---
title: How a simple admission webhook lead to a cluster outage
date: 2019-09-05 02:08:00 +0000
external_url: https://blog.jetstack.io/blog/gke-webhook-outage
---

Jetstack often works with customers to provision multi-tenant platforms on
Kubernetes. Sometimes special requirements arise that we cannot control with
stock Kubernetes configuration. In order to implement such requirements, we’ve
recently started making use of the Open Policy Agent project as an admission
controller to enforce custom policies.
