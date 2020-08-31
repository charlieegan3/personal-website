---
aliases:
- /blog/2016/09/05/development-rebundling-in-dockerland
title: "Development Re-bundling in Dockerland"
date: 2016-09-05 22:17:40 +0000
external_url: https://unboxed.co/blog/docker-re-bundling/
---

When starting out development on a Dockerized application, adjusting Dockerfiles
and rebuilding images is a common task. Bringing together two separate services,
as well as applying some gem security patches, we found ourselves doing this a
lot. The repeated bundle installations quickly became very painful.
Multi-tasking and regularly switching development branches only increased the
number of repeated builds required.
