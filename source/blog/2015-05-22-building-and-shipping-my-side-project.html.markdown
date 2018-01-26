---
title: Building and 'shipping' my side project
date: 2015-05-22 01:00 UTC
---

I started lurking on Hacker News and Product Hunt at the beginning of the year. The motivation for building [serializer](http://serializer.charlieegan3.com) came from an approaching assignment deadline, rather than cutting out news I thought I'd make following it more manageable. For me this meant a sequential feed - I didn't like having to scan the entire ranked list for new items.

**March 6th:** The first working version took around 30 minutes to build and was running on Heroku soon after. This was prior to the new [dyno pricing](https://www.heroku.com/beta-pricing). I used kaffine (discontinued) to keep the site alive.

I decided on a name pretty quick and bought serializer.io the next day. Students got a discount on *.io* domains at Namecheap (at the time).

![Version 1](/blog/2015-05-22-building-and-shipping-my-side-project/v1.jpg)
*Version 1*

**March 11th:** I read this [blog post](https://news.ycombinator.com/item?id=9184448) (about 'shipping' side projects) it was probably shared on Hacker News. (edit: it was [shared on Hacker News](https://news.ycombinator.com/item?id=9184448)).

I set to adding some extra features. Read-to-Here marker, 'loginless' syncing, pick and choose custom feeds and tweet counts came about pretty quickly.

At this point I was still the only user of serializer.

I worked quite hard to get the page weight down. The only javascript on the site is Google Analytics and a timer to refresh the page in the background. The assets are all compressed and images served via [Cloudinary](https://github.com/cloudinary/cloudinary_gem). The feed pages should be around 150kb.

**March 19th:** I posted comments on HN on a few [relevant](https://news.ycombinator.com/item?id=9206427) [posts](https://news.ycombinator.com/item?id=9282219) and acquired my first regular user (Fort Colins, Samsung Galaxy Note 3 if you're out there!).

**April 2nd:** I added the word count feature (and a save to Trello Reading List feature that's live but isn't really ready for the world yet).

**April 19th:** Switched to a $5 Digital Ocean droplet using [dokku-alt](https://github.com/dokku-alt/dokku-alt) and made the [source public](https://github.com/charlieegan3/serializer). This was in pursuit of better performance as well as in response to Heroku's pricing changes. serializer is still going strong on the same $5 droplet.

I took a break for a while after that, only making very minor changes over the exam period when I needed a break from the books. I started using an ['over 10 url'](https://news.ycombinator.com/over?points=10) for Hacker News and made some other adjustments to marginally reduce the number of collected items. Pressure of exams and all that.

**May 15th:** I added a link to [points](https://news.ycombinator.com/item?id=9462755), a cool app I'd seen on Product Hunt. I'd found it was pretty good at summarising articles wanted make it a feature. I reached out to points and heard back from [Hugh Jones](https://twitter.com/hjonesr), he liked serializer and the points connection and offered to setup a post on [Product Hunt](http://www.producthunt.com/posts/serializer-io).

**May 18th:** serializer did better than I ever expected and finished the day in the top 10 with around 100 votes at the time. Since I hadn't done any promotion before I saw a vast increase in traffic, I was impressed that the droplet held up.

![trend](/blog/2015-05-22-building-and-shipping-my-side-project/trend.jpg)
*This weeks trend, can you spot the Product Hunt boost?*

This in turn led to some really great feedback from Product Hunters on Twitter and via the feedback form. In response to this I've made the following changes over the last few days:

* Display unread count in the tab title.
* Added an apple-touch-icon.
* Reduce chances of users being assigned the same random session identifier (potential error)
* Revise the feedback page, trying to move over to GitHub Issues and a [TypeForm](https://charlie43.typeform.com/to/tZWtCn) for feedback.
* Add some pointers to the [GitHub repo](https://github.com/charlieegan3/serializer).
* Added clarification to the way the session links work. You just need to visit the session path on each browser and then use the site as normal.

Looking forward, I think serializer is fine where it is. I might add some more sources and tidy things here and there, but nothing major. **I'm never going to try and make money from it**.

It solves a problem for me (and apparently some others too). At the end of the day that's all it needs to do.
