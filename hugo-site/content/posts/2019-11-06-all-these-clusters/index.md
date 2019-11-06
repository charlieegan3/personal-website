---
title: What to do with all these cluster updates...
date: 2019-11-06 19:51:40 +0000
---

This year at work I've been building out a platform on Google's managed
Kubernetes offering GKE. While GKE makes it easier to automate the provisioning
and management of clusters - managing updates of anything more than a handful of
clusters can quickly becomes painful without the right tools.

This post outlines some features I've either come to value or will prioritize in
future when faced with cluster sprawl. I limit these features to the practical
management of clusters updates so as to keep the scope of the post small.
Monitoring & alerting would be another interesting list but you won't find that
here...

## Where did all these clusters come from anyway?

It's easy to underestimate the number of clusters you'll end up managing. Sure
you'll maybe have one for each environment. Usually that'd be three at a
minimum, for me this number was five.

This isn't a post about managing five clusters though. There are lots of
dimensions that have a multiplicative effect. These will be different for each
of us. My other dimensions were separate hardware for data processing reasons;
long term migrations to and from different cloud accounts and deployments in
different regions.

The obvious one is different teams or groups. However, I didn't find myself in
this situation.

All in all, in the end I found myself managing a fleet of around 30 clusters.

I'm of the view that the best way to create and update GKE clusters right now is
using Terraform. Where I work at Jetstack we have a [Terraform
module](https://github.com/jetstack/terraform-google-gke-cluster) for this job
if you've not started yet. This post will make some references to Terraform use.

## Multi-dimensional cluster deployments

With my environments multiplied by my other dimensions I found myself with N
development, N stage and N production (etc. etc.) clusters. This quickly grew to
a number that made it impossible to complete a master+node pool upgrade within a
working day when deploying updates in series.

I want a means of controlling which clusters can be updated in parallel and
which can't. For example, I might want to roll out all my dev clusters at the
same time.

Many continuous deployment tooling is not set up in this way and as more cluster
configs land it can quickly get out of hand if they're run in series. I suppose
cluster upgrades are likely to be the longest deployments in the whole business
(and perhaps by some margin too).

This raises the question - are synchronous pipelines really the best way to roll
out cluster updates? In the long term, with things like Cluster API perhaps
not...

## One plan to rule them all

When you're sitting in front of a multi-hour pipeline run, it's nice to know
what's coming up next. With Terraform version prefixes or GKE alias versions
it's possible to find that you're actually about to roll out a minor update to
all your clusters.

I guess this comes down in part to one's use of Auto-upgrade. I was not using
this feature in this case.

Terraform `plan` you might say. Perhaps, but I think there's a benefit to
keeping the Terraform stacks small to reduce the blast radius and enable the
above feature of concurrent cluster deployments.

In the end this was a script for me. It parsed our cluster manifests and made
calls against the GKE APIs to check the master and node versions against the
values we had in config. This allowed me to warn of inconsistencies from missed
runs and any unexpected updates.

I suppose that ideally these might be better implemented as a Prometheus
exporter that alerts when config falls behind the available GKE version for that
prefix in that location.

## Terraform `version_prefix` and `timeouts`

There's a data resource in Terraform called `google_container_engine_versions`.
This enables the selection of cluster versions from the available versions in
that location in a predictable manner.

This can be used to give a similar behaviour to the [GKE alias
version](https://cloud.google.com/kubernetes-engine/versioning-and-upgrades#specifying_cluster_version)
feature - however that can lead to version mismatches when deploying in
different regions due to differences in availability. With this feature it's
possible to use a prefix (read GKE alias) but also drop down to a fixed version
if required. There's an example of this in my [personal infrastructure
repo](https://github.com/charlieegan3/infrastructure/blob/3fa0a3da49ba06b5f63edf5fa62e66ba0acd0436/gcp/charlieegan3-cluster/cluster.tf#L1-L13).

[`timeouts`](https://www.terraform.io/docs/configuration/resources.html#operation-timeouts)
are probably part of your config already but they deserve a mention. Set these
allowing for 30 mins for a regional master upgrade and 12 mins for a node
upgrade if you want to be safe. Those are around the maximums I've seen this
year anyway.

## Pesky PDBs

`PodDisruptionBudget`s can easily be misconfigured by tenants and can delay node
upgrades to their maximum deadlines. Something I'd to play with is an OPA policy
to block PDB resources where minAvailable is set to an inappropriate value for
the desired replicas of that deployment.

<hr/>

That's my half wish list, half brain dump of GKE cluster upgrade tools.

Once feature that would make a lot of this less painful would be be some dials
to tune on the rate at which GKE cycles nodes. Something like a deployment with
maxSurge and maxUnavailable would be nice but on a basic level a feature
comparable to AWS CodeDeploy's AllAtOnce would be good to have for some pre
production environments. GKE Product team if you're listening...

I was working with relatively small clusters of big nodes, thoughts and prayers
for those with more nodes... hope you found an entertaining book to read...
