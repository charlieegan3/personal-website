---
title: Multi-Cloud Workload Identity With SPIFFE
slides: true
repo_url: https://github.com/jetstack/spiffe-connector
blog_url: https://www.jetstack.io/blog/workload-identity-with-spiffe-trust-domains/
events:
- name: "KubeCon EU 2022"
  url: "https://kccnceu2022.sched.com/event/yttX/multi-cloud-workload-identity-with-spiffe-jake-sanders-charlie-egan-jetstack"
  date: "2022-05-20"
  location: "Valencia, Spain"
  video_url: "https://www.youtube.com/watch?v=vKRUq56xDiE"
  copresenters:
  - name: "Jake Sanders"
    url: "https://github.com/jakexks"
---

## Abstract

Within a single cloud provider, accessing secured APIs using your own workload identity is simple. Cloud SDKs used by
application developers know how to retrieve identities and credentials from the cloud environment for each workload
based on its context. A cloud administrator can then assign permissions to these identities which allow access to the
required APIs.

This is seamless for developers - simply calling an API in their code just works, while behind the scenes
the network call is cryptographically authenticated / authorized.

Unfortunately for the user, this identity is cloud-specific. With few alternatives, this often leads to long-lived
credentials being mounted into workloads instead.
This is less secure and harder to use. This presentation will show an alternative solution which combines features of
open source CNCF projects Kubernetes, cert-manager, cert-manager-csi-driver-spiffe, cert-manager-trust and
spiffe-connector to expand your SPIFFE trust domain to any cloud.

## Photos

![photo my myself and Jake after the talk](photo.jpg)
