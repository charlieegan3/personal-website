---
title: "TIL at Container Camp"
date: 2016-09-09 22:22:23 +0000
---
I was lucky enough to get today off and attend [Container Camp](https://container.camp/uk/2016/schedule). Still relatively new to containers I had a lot to learn, here are some of the most important things I took away from the day.

## There are all sorts of different types of container

So far I've only ever used Docker containers. I knew there were other container runtimes around but hadn't taken the time to compare them. Mark Shuttleworth's presentation about 'Snaps', a sharing container format for application distribution; Jonathan Boulle's talk on rkt and rktnetes and Dustin Kirkland's about Linux Containers in a high-performance computing environment all introduced (to me) a different take on the container idea.

However, Liz Rice's talk about building a container from scratch was the first one that really filled in some big blanks in my understanding of the container definition.

## Containers are actually still pretty new

For some reason I hadn't picked up on just how much still needs doing to fully deliver on the container promise. There are all sorts of scheduling systems, and all sorts of things that aren't quite there yet. Ben Firshman's talk about serverless web apps in Docker showed both gave a glimpse of some cool possibilities despite some of the current limitations in Docker Swarm.

Various speakers made reference to OCI and the value that comes from having a standard.

## Other people got fed up waiting on container image pulls

George Lestaris's talk about the problems and alternatives to layer based image distribution really got my attention. CernVM-FS & the IPFS apparently offer something of a solution to superfluous layer pulls, and this is already in use in Mesoshere? Something I clearly need to read up on.

## There are various benefits of containers in production

I hadn't fully taken on board the other benefits of containers in production. When [playing with Kubernetes](http://github.com/charlieegan3/kubernetes-examples) I'd thought it was fun but perhaps overkill for a simple Rails app & database. Turns out that using a distributed scheduling solution, Kubernetes or otherwise, can also give you faster deploys, rollbacks, monitoring, cheaper hosting among many others with _relatively_ little extra work.

## Persistent workloads are (quite a bit) more complex

Some Orchestration tools seem to be missing a clear means of running persistent workloads. It also seems to be a new feature in those that do. This seems to line up with my experience of getting a SQL database running. I think I need to spend some time looking into [ways to do this properly](http://blog.kubernetes.io/2016/09/creating-postgresql-cluster-using-helm.html).

***

I got a great deal out of the day - lots of really interesting things to test out and perhaps even contribute to. Really well run event and a great venue.
