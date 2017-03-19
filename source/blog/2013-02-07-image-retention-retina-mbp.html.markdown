---
layout: post
title: Image Retention Retina MBP
date: '2013-02-07T00:30:00+00:00'
tags:
- apple
- genius
- rMBP
- display
- retina macbook pro
- samsung
- image retention
- retina
- LG
- screen
---
The first ’[Retina](http://www.tuaw.com/2012/03/01/retina-display-macs-ipads-and-hidpi-doing-the-math/)’ Macbook Pros were revealed at last years [WWDC](http://www.youtube.com/watch?v=TPFQVbyITcY), the main feature being the screen of course. And what a screen is. I would say, apart from my [phone](/blog/2012/12/05/phase-of-phablet-review.html), that the money spent on my rMBP has been the best I’ve ever spent. One problem nags at the heals of perfection: _Image Retention_.The problem doesn’t seem to effect all models and originally I didn’t think it effected mine - however recently it seems to have gotten a fair bit worse leaving ‘border burns’ on my grey background after a few minutes. The largest percentage of effect machines seems to be those with LG screens. Apple outsourced the manufacture of the retina specification screens to both LG and Samsung to cope with demand. It seems the LG ones were of lower quality for some reason. Running this command spills the beans on which you got landed with.

> ioreg -lw0 | grep \"EDID\" | sed "/[^
So yeah, I’ve got an LG screen…
The best test for image retention is over a solid grey background and after showing a high contrast image full screen for about 10 mins. On reverting to the background, I see the scars of the image that is no longer being displayed.

Originally Apple were denying this as there own display tests weren’t showing it up, however now it's considered a 'know issue’ and owners can get returns. My 'Genius’ appointment is tomorrow.

Many say not to bother - and perhaps you wouldn’t on a budget machine - however, on a machine where the screen alone amounts to around £700 I think you count as within your right to ask for a swap (or more…).

[Further Reading](http://forums.macrumors.com/showthread.php?t=1422669&highlight=image+retention+test) at _MacRumors_
