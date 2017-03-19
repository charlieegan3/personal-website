---
layout: post
title: 'Enter: serializer.io'
date: '2015-04-14T22:07:59+01:00'
tags:
- social news
- hacker news
- reddit
- news
- reading
- project
- website
---
I’ve tried time and time again to make following tech news work for me. It seems to be an inordinately tough problem (for me) to solve (for myself).

In the early days it was simple, I followed _MacRumors_ and _Engadget_. I just visited their sites regularly. As I explored a little and discovered some other sites I wanted to follow the need for a basic news reader arose. I also started to read stories on more than one device. After some experimentation I settled on _Feedly_. I got into this around the time that _Google Reader_ was being phased out and _Feedly_ certainly served me well.

_Feedly_ synced reading progress well but didn’t seem all that great at syncing the news! It was often the case that upon reaching the ‘end’ you’d find there were another 20, and then another 20 and so on… This grew to annoy me quite a bit and I started to look elsewhere.

At the beginning of 2014 it became clear there wasn’t an app or service that offered all the features I saw as essential. Marking as read, reliable story sync being the main two. Polling feeds takes time and I realized that I needed to do this part myself - or get write something so Heroku did it for me.

I built a Rails app that polled my chosen feeds and grouped stories if they were deemed to be the same. This solved the duplicate story problem that grew out of following a greater number of sources. Each day the application would send me an email of the the top stories, based on degree of reporting overlap. I used this for around 2 months.

A combination of _IFTTT’s_ new twitter search trigger and wanting to follow _newsyc20_ on twitter made me leave _‘Article Engine’_ behind (yep that’s what I called it…). Using the _IFTTT_ trigger I setup daily emails all the matching tweets. Luckily places like _Macrumors_ &amp; _Engadget_ all tweet new articles. This was the longest lasting solution - It took about a few good months to show any signs of cracks and almost a year to be retired. In the end it had to go when it started missing tweets and sometimes emails summaries too.

In an effort to cut back on news consumption (to focus on some exams) I started **only** following _Hacker News_. I think _Hacker News_ is great and earlier this year I created a tool to make it work even better - for me.

I wanted the content of _Hacker News_ in a **feed** and I wanted my progress along this feed to sync across devices. Enter _serializer_!

_serializer_ became a hosted side project of mine with its own domain after reading [this post](http://www.slashie.org/articles/shipping-side-projects/) about ‘shipping’ side projects. That inspired to change _serializer_ into something that might be useful to others.

_hckrnews.com_ ticks the linear box but doesn’t have any syncing / saving of state.

So instead I built _serializer _into a tool with these features:

* Read-to-here marker
* Sessions for cross-device syncing without logins
* Customizable source feeds for users who aren’t me (I currently track /all)
* Reading time estimates (based on 300wpm and a simple page content extractor)
* Tweet counts for recent items
* Basic duplicate removal

My session also has a save to _Trello_ button who kindly host my 'multilevel reading list’. I plan on ‘releasing’ this at a later date.

I have _lobste.rs, slashdot, betalist, macrumors, qudos, designer news _&amp;_ arstechnica_ as well as _HN_, _r/programming _&amp; _producthunt_ as selectable sources on /custom.

serializer feels like it’s here to stay as my source of news - perhaps largely due to the amount of work it’s been!

If you’re interested [take a look](http://www.serializer.io) and let me know what you think.
