---
title: "Modern workload identity with SPIFFE & Trust Domains"
date: 2022-08-12 11:00:27 +0100
external_url: https://www.jetstack.io/blog/workload-identity-with-spiffe-trust-domains/
---

A workload is a running instance of an application. Workload identities are how
workloads trust and get trusted by each other. Workloads need to communicate
with other workloads to function and, in doing so, need a mechanism to prove
their identity to others. At the same time, they often need to be able to
validate the identity of callers. There are many ways to solve this problem,
but it can be a tricky one to get right.
