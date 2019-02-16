---
aliases:
- /blog/2016/12/26/a-weekend-with-the-google-cloud-platform
title: "A Weekend with The Google Cloud Platform"
date: 2016-12-26 20:16:37 +0000
featured: 6
---

For some time I've been looking to consolidate my 'side project infrastructure'. I have two projects running Digital Ocean droplets ([serializer.io](http://serializer.charlieegan3.com) and standpoint); json-charlieegan3 runs on [hyper.sh](https://hyper.sh) making use of an S3 bucket; [charlieegan3.com](https://charlieegan3.com) runs on [Netlify](https://www.netlify.com) (but is about to move to App Engine standard) and I have the usual handful of tasks & apps running on Heroku.

These projects mostly run for free but when the credits run out early in the new year they'd cost almost $30 a month. So - with that budget in mind - I've been looking around for somewhere to run and manage all these projects from the same provider. I'm also trying to learn something new in the process.

At the end of October I attended GCPNext here in London and have since been trying to find the time to play GCP. I managed to do this, finally, two weekends ago weekend. Here's my take.

# Billing

I started out setting up billing alerts; price pretty important to me. I don't expect any of my projects to generate income so I'm doing this on the cheap.

GCP billing information could be more accessible. Projects on your account are associated with a billing account - using the platform as an individual you'll likely only have one of these for all your projects. On the billing accounts view one can set budgets and alerts; but these only seen to update after quite long intervals - I think daily. There's also no way to see a cost breakdown without looking at an invoice (delivered monthly) unless you set up a _Billing Export_.

Billing Exports seem to update more regularly and come in CSV and Big Query flavours. These list itemised expenditure for different platform usage (CPU time, storage use, static IP etc.). The Big Query export is cool and is nice to use but the fact that I need to write code to get a cost breakdown by project or find out the most expensive service for my usage feels frustrating. It would be a cool addition to a more standard billing & usage view. I also find the idea that the if you'd burnt though your free TB Big Query allowance for the month you'd pay to get your billing breakdown quite amusing!

```sql
-- Query to get an expenditure breakdown by project
-- (Information not available in the UI)

SELECT project.id, sum(cost)  FROM [billing-bucket]
GROUP BY project.id
LIMIT 1000
```

# Projects

Next I moved on to projects. I knew I could host a static site using the App Engine Standard Environment. Standard Environment applications can be python, node, go or java and run with a number of restrictions. Using a simple app.yaml to define a number of handlers for my static site I was able get my site up and running. I used wercker to configure a simple CI/CD pipeline.

Being able to deploy with `gcloud app deploy` from my machine and using the wercker step was nice but Netlify was infinitely easier; and considerably faster to deploy. The app deploy command seems to be pretty slow from my laptop over a fibre connection but quite quick on wercker. Not sure why this was.

I added certs from Let's Encrypt quite easily using the UI. It's also pretty clear how to set the DNS records for the bare and www domains.

In summary this first project went well. I didn't gain anything over my previous Netlify setup; arguably loosing some speed and ease of use. I did learn more about the tooling though which helped later on.

# Rails & Cloud Datastore

Next I opted to deploy the [Rails Cloud Datastore sample](https://github.com/GoogleCloudPlatform/getting-started-ruby/tree/master/2-cloud-datastore). Most of my projects are Rails simple apps and I was keen to find out what the options were for these too. This brings me on to the Google App Engine Flexible environment. The flexible environment will let you run applications that can be deployed as a container - but this flexibility comes at a cost. This cost is again, I found, impossible to calculate and only with real usage could I tell how expensive it was. After spending £6 in the first day I opted to switch off the application.

I also had a bit of a hard time with the Cloud Datastore. I'm aware CloudSQL but I remind you that cost is the key factor here (running a CloudSQL instance - per app - would put me over my monthly budget). I found that I was able to get something working but [as you can see the example](https://github.com/GoogleCloudPlatform/getting-started-ruby/blob/master/2-cloud-datastore/app/models/book.rb) there's a fair bit of re-writing ActiveRecord-like functionality and it just felt wrong. Additionally I found the the Cloud Datastore would fail on the first request after a period of inactivity - only to work immediately on the subsequent request. I found the Ruby documentation for the product thin at best.

These cost issues coupled with the Cloud Datastore problems mean I no longer have any Rails apps running in the Flexible Environment.

# CloudDNS

In my efforts to double-down on GCP I also tried moving the DNS config of a domain over. I quickly found that I wasn't able to do redirections nor email catch all forwarding so I've move the staging domain back to Namecheap's basic DNS.

# Concluding

The one big positive of has been Big Query. I really enjoyed querying the Github dataset on there - I had a specific task for this though that I'll write up in another post. I spent almost £15 on Big Query though so I'll need to hold off until next month now...

Generally though, my opinion is pretty mixed - the console UI is simple; the CLI is great & the standard environment is also nice to have. The biggest let down is the sorry state of billing/expenditure information.
