---
layout: post
title: Trigger Happy
date: '2013-01-28T00:30:00+00:00'
tags:
- google drive
- IFTTT
- review
- twitter
- automation
- email
- lastfm
- foursquare
- online services
- blogger
---
This is the first review I’ve done on here for quite a while - here’s my take on [IFTTT](https://ifttt.com/). [+IFTTT](http://plus.google.com/109525093279809082285) is an online automation service that brings together many online applications. Before I begin there is some IFTTT jargon that you should know:

  * Channel: An application that you have ‘linked’.
  * Trigger: An event that a Channel has. _e.g. 'New Mail Recived’._
  * Action: A task that a Channel can complete automatically.
  * Recipe: A combination of a Trigger and an Action.

To give you a feel two of my current recipes are: Post a link to all my new blog posts on [Twitter](https://twitter.com/charlieegan3/status/293880685662437378) and Add an event to my 'Places' calendar whenever I check in on [Foursquare](https://foursquare.com/charlieegan3). All the recipes I use are also used by others, there’s a sharing feature, however I’ve made modifications to suit. Custom recipes are also really easy to set up.

I [mentioned](/blog/2013/01/17/musical-menology.html) not so long ago about logging my music - this system has some flaws. It only accounts for the dates the files were created and doesn’t keep a log of every single track you play during a day. However, with the help of the last.fm and Google Drive APIs, I have now solved this problem with IFTTT. A simple Recipe is now triggered every time I play a song, it’s action being to log the song, artist and time in a spreadsheet.

There are a few minor issues with the service, but none come close to being major. 

  * It’s only as good as the APIs it uses. By this I mean: If an API is weak, lacking in features or none existent ([Google+](https://twitter.com/adamjwray/status/293896078686818304)) there is nothing you can really do. There are a few work arounds with 'Send and Email to Add’ features but they are often far from perfect and fail to accomplish anything close to the functionality of a powerful API.
  * Multi Action Recipes. Perhaps best explained with an example: I have three recipes where Blogger is the trigger, all with different actions. Surely it would be more efficient to group these? Say, when this happens, do these three things - that just seems more natural to me.
  * The site’s interface is nice, however it should have a 'condensed view’ for viewing your recipes. It’s as if they only ever expected people to have a handful of recipes. It would be nice to have a more tabular view available for those users with more recipes.

If you’ve read though this and still don’t really understand what it’s all about head [here](http://lifehacker.com/5842307/how-to-supercharge-all-your-favorite-webapps-with-ifttt) or just head over to [IFTTT](http://ifttt.com/) to…
