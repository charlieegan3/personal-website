---
aliases:
- /blog/2017/03/31/actioncable-on-aws
title: Running ActionCable behind Elastic Load Balancers on AWS
date: 2017-03-31 22:08:00 +0000
external_url: https://unboxed.co/blog/actioncable-on-aws/
---

We were recently tasked with adding a feature that showed the status of a IoT
device as it changed. It was important that the status page updated quickly; and
given we’d recently upgraded to Rails 5, this was a prime opportunity to learn
ActionCable. What follows is a post detailing how we overcame a number of
challenges in getting the feature deployed.
