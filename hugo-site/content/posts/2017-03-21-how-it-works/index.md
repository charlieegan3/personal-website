---
aliases:
- /blog/2017/03/21/how-it-works
title: How this website (currently) works
date: 2017-03-21 00:48:53 +0000
---

While _charlieegan3.com_ has been my 'online home', my personal site has gone through various revisions. Personal websites are subject to an above average level of tinkering and experimentation. I thought it time to pause and write about the interesting elements of the current setup.

I've been using a static site generated using middleman since the [end of 2015](https://github.com/charlieegan3/personal-website/commit/5687489e86540f48d6760d7f1de6060a04b7abc6). What started happily as a GitHub pages site [moved](https://github.com/charlieegan3/personal-website/commit/5a09e57763d8b16b5f6a4efe4630736e8718606c) to Netlify last year to take advantage of their free HTTPS on custom domains. I really enjoyed using Netlify and think it's a great tool. At the end of last year; after attending GCPNext I got into playing with the the (free) App Engine Standard environment - _charlieegan3.com_ was the simplest project of mine that I could use to try it out. Most of my projects are Ruby-based and you can't run Ruby on the free App Engine tier. It was time to move, again. Here's the setup I've arrived at - it's one I'm fairly happy with.

## Wercker

Prior to my App Engine experiments, I also looked into the Google Container Engine for hosting some of my other more involved projects. I found a tool called [wercker](https://www.wercker.com) that I liked the 'interface' for and was keen to keep using on the App Engine for my personal site. The wercker config file; where each pipeline starts from a container image (e.g. one ready to build my site or equipped with the gcloud tooling for deployment) made a lot of sense. So my wercker workflow looks a little like this:

1. **Build** - starting point image: `ruby:2.3.3`
  * clone the source
  * bundle install
  * middleman build -> build directory

2. **Deploy** - starting point image: `google/cloud-sdk`
  * (only ran if build completed successfully)
  * (using the build artefact from the last pipeline)
  * deploy the site to the app engine using the gcloud toolchain.

I've found basing each pipeline step in the workflow on a 'pre-loaded' image like this makes the deployments quite quick - under 2 mins to build and publish the site.

## Automatic broken link checking

I had imported my old posts from Tumblr some time ago but hadn't bothered to check them all for broken links (I found the [broken-link-checker](https://www.npmjs.com/package/broken-link-checker) to be the best thing for this task). I also realised that my `app.yaml` handlers where not serving some of my post attachments. After fixing this issues I thought it'd be nice to automate checking internal links before deploying.

I toyed with the idea of serving the site with one process and running the checker against it in a `Link Test` wercker pipeline. After some looking around I found [HTMLProofer](https://github.com/gjtorikian/html-proofer), a gem for checking validating static HTML. With the help of a little monkey patching to sort out an encoding issue I was able to set this up as an [after_build callback](https://github.com/charlieegan3/personal-website/commit/0e7eac36c74d41baf89f6ac50d02ac930bc5aaea#diff-2620489c404159b5404f13f82e470fbdR109).

Now if I try and deploy a broken link or a page that renders to invalid HTML the site won't deploy.

## Live Status

I have a task that runs every 10 mins on Heroku to update the live sections on the homepage. This is a [separate repo](https://github.com/charlieegan3/json-charlieegan3) and is basically a set of scrapers and API clients for a number of sites and services I use around the web. The task gathers all the latest data from each service and pushes the result to a [json file](https://github.com/charlieegan3/json-charlieegan3) in a storage bucket. There is also a [fallback copy](https://charlieegan3.com/status.json) of the status file saved into the build directory when this site is built. This project is pretty hacked together; I'd like to make it more modular but for now it does the job. I think the live sections on the homepage are a nice feature.

## Noscript Friendly

Until this last weekend the site didn't load correctly without Javascript, shame; shame. The good news is that it now works fine. The live status panels only display in when the data's there and the page re-arranges itself. I've also opted to add turbolinks to the site as it makes switching pages faster and gracefully degrades in the absence of Javascript.

***

I think it's interesting to explore what we can do with a "static site" and think simple projects like this are often a place to try out new things that might be harder to justify in more involved applications.