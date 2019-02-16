---
aliases:
- /blog/2017/03/20/deploying-indigo-falcon-to-production
title: Deploying indigo-falcon to production!
date: 2017-03-20 22:08:00 +0000
external_url: https://unboxed.co/blog/deploying-indigo-falcon-to-production/
---

On the Bookmetrix project we used a different process for managing our releases
in git. We took feature branches from master and opened pull requests with a
‘release branch’ as the base. If a PR wasn’t approved before it’s base release
was merged then it’s base was moved to the branch for the next release instead.
