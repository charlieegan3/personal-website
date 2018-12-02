---
title: "Tracking all the plays or how I learned to stop worrying and build my own Last.fm"
date: 2018-11-20 23:22:48 +0000
thumbnail: /blog/2018-11-20-how-i-learned-to-stop-worrying-and-build-my-own-lastfm/thumbnail.png
---

For my latest side project I built a tool to better track the music I listen to.
I now have a single BigQuery table with my play history from Spotify, Youtube,
Soundcloud and Shazam. I also have a [simple
site](https://music.charlieegan3.com/) to present the data.

In this post I explain why I did this, exactly what I've built and what I might
do next with the project.

# _Why:_ I was loosing play data

I've been a long time [Last.fm user](https://www.last.fm/user/charlieegan3).
When I first started 'scrobbling' to the service I used iTunes but the bulk of
the data on my profile there has come from the Spotify integration.

I'm very grateful for this feature. Had it not been there, the benefits to me of
using Spotify on multiple devices would have outweighed the hassle in tracking
my plays. Thanks to this feature, I've got a great starting point for my new
project.

However, I found that the integration was a little flakey and I was loosing play
data. Sometimes I'd be signed out of Last.fm after an update and I'd not realise
I needed to sign back in.

This was the first reason that prompted me to think about investigating this
problem.

# _Why:_ I wanted to 'own' my data

Last.fm are very nice to me. They store my plays and present them back to my
with a some nice graphs and views.

However, it's not very flexible. I can't write my own views and I don't have
access to the raw data to ask the questions I want. On top of that, I don't
think the few visualizations I use are that hard to recreate.

I've been trying to follow on from my [photos
project](https://photos.charlieegan3.com/) project and maintain a separate
presentation of my social profiles that I control.

My play data seemed like a good candidate. It was 'larger' than the photos
dataset and I thought it would provide some new challenges and learnings (which
it did, spoiler alert, oops, that was all backwards, sorry-not-sorry).

# _Why:_ I wanted to track other sources without a Last.fm client

Last.fm clients were an option and something I experimented with. I found the
Android options to be OK but ultimately unsuitable.

I found myself listening to music on Soundcloud and
[Youtube](https://youtu.be/67HOjCV8dqA) a (little) more often and wanted to save
this play data too.

# _Why:_ I wanted to track other events and information

Eventually, I wanted to start tracking additional events beyond plays. Some
examples:

- Which tracks were added and removed from my playlists and when
- How long the tracks were that I was listening to (Last.fm didn't seem to
  expose much here)
- erm, that's about it actually

<hr/>

Now onto the what I did to address this pressing first-world problem I faced.

# _What:_ I 'built' a BigQuery table & a program to push data from Spotify

First I wrote a simple program that make a call to the Spotify API to get the
recent plays for the current user (me). This list is limited to 50 so it needs
to be run quite regularly to ensure all the data is captured.

This program is packaged as a container and run every 15 mins as a `CronJob` on
my personal cluster.

It queries the list of already saved tracks to get the most recent one. It then
iterates over each of the played tracks and imports all of the tracks played
after the latest of the last import (in ascending order).

This has been the first project where I've done the whole Terraform from the
ground up thing too (which involved a little legwork to move some existing
resources under Terraform). There are a few resources outside of Kubernetes
including a Google Cloud project, BigQuery table, some storage buckets and a
service account.

There have been a few iterations on the table schema but this is the current
field list. Everything just goes into one big table.

```
track
artist
album
timestamp
created_at
duration
album_cover

source

spotify_id
youtube_id
youtube_category_id
soundcloud_id
soundcloud_permalink
shazam_id
shazam_permalink
```

With this data, I can do some fun things...

Count the plays for each track:

```sql
SELECT
  track,
  artist,
  count(track) as count,
  STRING_AGG(album, "" ORDER BY LENGTH(album) DESC LIMIT 1) as album,
  ANY_VALUE(duration) as duration,
  ANY_VALUE(spotify_id) as spotify_id,
	STRING_AGG(album_cover, "" ORDER BY LENGTH(album_cover) DESC LIMIT 1) as artwork
FROM `charlieegan3-music-1.music.plays`
GROUP BY track, artist
ORDER BY artist ASC, count DESC
```

Get my 10 most recent Shazams (see next section):

```sql
SELECT track, artist, timestamp
FROM `charlieegan3-music-1.music.plays`
WHERE source = "shazam"
ORDER BY timestamp DESC
LIMIT 10
```

Get a sorted list of my top Halo soundtrack plays across all the different
albums.

```sql
SELECT artist, track, album, count(track) as play_count
FROM `charlieegan3-music-1.music.plays`
WHERE REGEXP_CONTAINS(album, r'Halo')
GROUP BY artist, track, album
ORDER BY play_count DESC
```


# _What:_ Next, I built a website & some more integrations

I wanted to go end-to-end quickly and have a simple 'view' into this dataset I
was accumulating. The site is at
[music.charlieegan3.com](https://music.charlieegan3.com/).

It has a few pages. Each page is based on a single JSON file built from one or
more queries made against BigQuery. The recent plays file is updated every 15
mins, the others are less regular. They're all stored in a Google Cloud Storage
bucket. The site itself (not the JSON data) is served from an nginx container in
the cluster (makes the subdomain config and updates more similar to my other
projects. General rule for new projects if it's stateless, it runs in the
cluster).

I also built some more integrations (a key requirement of the project). Youtube
came first after Spotify - it was really hard. Youtube's API no longer exposes
the 'Watch History' 'Playlist'. It used to be accessible as a playlist with the
ID `WH` but that was disabled a few years ago - I suspect for privacy reasons.
Still, it seems a shame to me that I can't get the data for my own account...

To get around this I needed to fall back to my roots and build a scraper - just
like old times. Youtube's page is rendered from 'initial data' served as part of
the page. This is JSON, yay. It is also a complete labyrinth, boo. I was able to
use [gron](https://github.com/tomnomnom/gron) and to grep out the parts
of the JSON I was interested in and used
[gojson](https://github.com/ChimeraCoder/gojson) to generate a struct to
unmarshal it into.

This took ages but in the end I was able to get the metadata from the content ID
table for each video in a format that was good enough to save into my table.

I also built similar scrapers for Shazam and Soundcloud but they're DOM /
private APIs were much less surprising.

So far I've been running these for about a month and they've not broken -
fingers crossed. I'm used to playing the scraper time bomb waiting game.

# _Where Next:_ Some ideas for the future

Visualizations. At the moment there is only one graph on the site - the plays
month. This is about as good as my charts get. Luckily ma boi, @tlfrd is on the
case with a [proof-of-concept 'viz'](https://beta.observablehq.com/@tlfrd/plays)
showing the lifetime play history for individual songs. I'm really interested in
improving the presentations of the data in time. However, now the collection
side of the project is in place I'm going to be pausing for a bit.

Another idea I had was to send email summaries each week showing my play data. I
think this might also serve as quite a good monitoring function (i.e. to check
that the data matches what I remember listening to).

I'm also considering syncing the data back to Last.fm or
[Libre.fm](https://libre.fm/) but I think this is close to the bottom of the
list for me at the moment.

<hr/>

So there we have it. Another rushed post about a side project that's been
distracting me recently.

I'm enjoying this as a general direction for my side projects though. Personal
Analytics / Quantified Self is so much more than calorie counting. The data's
there, you've just got to get it.
