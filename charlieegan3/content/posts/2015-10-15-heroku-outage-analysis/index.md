---
aliases:
- /blog/2015/10/15/heroku-outage-analysis
title: Heroku Outage Analysis
date: 2015-10-15 15:58:00 +0000
---

I'm in the process of writing a security report on Heroku. I was interested to know the number of times that attacks on the service caused downtime. I wrote a script to collect all of the [815 incidents](https://status.heroku.com/past) and then checked each report against the following expression: `/hack|attack|ddos|malicious|virus|vunerability|breach/`.

This returned the following incidents:
[156](http://status.heroku.com/incident/156),
[157](http://status.heroku.com/incident/157),
[245](http://status.heroku.com/incident/245),
[308](http://status.heroku.com/incident/308),
[489](http://status.heroku.com/incident/489),
[539](http://status.heroku.com/incident/539),
[665](http://status.heroku.com/incident/665),
[709](http://status.heroku.com/incident/709),
[738](http://status.heroku.com/incident/738).

Discarding false positives gave this list:

* [156](http://status.heroku.com/incident/156), DDoS, 27 hours, May 2011
* [157](http://status.heroku.com/incident/157), DDoS, 1 hour, May 2011
* [245](http://status.heroku.com/incident/245), DDoS, 4 hours, Dec 2011

In summary, all attacks that resulted in a service outage were caused by DDoS attacks, and all of these were in 2011.

All collected incidents can be [downloaded here](/posts/2015-10-15-heroku-outage-analysis/incidents.zip).