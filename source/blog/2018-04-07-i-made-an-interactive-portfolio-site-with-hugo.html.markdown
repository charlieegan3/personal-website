---
title: "I made an interactive portfolio site with Hugo"
date: 2018-04-07 17:44:26 +0100
thumbnail: /blog/2018-04-07-i-made-an-interactive-portfolio-site-with-hugo/photo_grid.png
---

My [last post](https://charlieegan3.com/blog/2018/03/04/backing-up-instagram)
explained about how I create backups of my Instagram posts. I had a few people
ask about why this was useful. Other than the Instagram doomsday-scenario, in
it's current form (a git repo with some images and JSON metadata) it wasn't.

I was ill over the Easter weekend and decided to make something with the data
I'd extracted. Enter [photos.charlieegan3.com](https://photos.charlieegan3.com).

The purposes of this new site are:

- Compliment rather than replace my public Instagram profile.
- Implement a number of features lacking or removed from Instagram.
- Offer a place to browse only photos, no ads, comments, popups etc.

Examples of some features:

- [A map of all the places I've been](https://photos.charlieegan3.com/locations/) -
  This was originally an Instagram feature but it was removed in 2016. The other
  nice thing about this is that I got Instagram before I first left the British
  Isles (we didn't go abroad when I was younger). This means that all the
  countries I've been to feature on the map.
- [List of photos with a given tag](https://photos.charlieegan3.com/tags/shotonmoment/) -
  Many of my hashtags are just junk but there are some I use reliably such as
  [#shotonmoment](https://photos.charlieegan3.com/tags/shotonmoment/) or
  [#architecture](https://photos.charlieegan3.com/tags/architecture/). Instagram
  doesn't offer a way to view all your photos for a given tags.
- [Nearby places](https://photos.charlieegan3.com/locations/hereford-cathedral-344225019/) -
  For a given 'place' (Facebook Graph Location), I've gotten my build scripts
  to do some Trigonometry and find other places nearby. So even if a place only
  has one photos, chances are the site will show some others nearby too.
- [Full Calendar](https://photos.charlieegan3.com/calendar/) -
  I made use of this [calendar](https://gohugohq.com/calendar/) implemented for
  Hugo. It means I can link to show all the photos on a given
  [day](https://photos.charlieegan3.com/archive/2018-02-20/),
  [month](https://photos.charlieegan3.com/archive/2018-02-20/),
  [year](https://photos.charlieegan3.com/archive/2018/),
  [calendar month](https://photos.charlieegan3.com/archive/02/) or even
  [weekday](https://photos.charlieegan3.com/archive/tuesday/).
- I also have a link to search for the original in my Dropbox/Google Photos
  accounts. This really is only useful to me as it requires a logged in session
  on those other sites!

All in, it's about 5k pages of html. Hugo can build this in about 16 seconds;
Netlify can deploy it in about 6 mins. It's also auto-updated 4 times a day
from a task running on Hyper.sh. With over 10,000 pages, [felixonline](http://felixonline.co.uk/)
is still the biggest static site I've made but if I post enough I might catch
up in a decade or so!
