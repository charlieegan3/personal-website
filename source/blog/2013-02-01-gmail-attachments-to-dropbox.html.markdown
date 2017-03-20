---
layout: post
title: Sending Gmail Attachments to Dropbox
date: '2013-02-01T00:30:00+00:00'
tags:
- dropbox
- IFTTT
- webmail
- gmail
- automation
- attachments
- attachments.me
---
Answer: [attachments.me](https://attachments.me/). Story:

With my phone I get access to a [50GB Dropbox](https://www.dropbox.com/help/297/en) - it’s a nice perk but one I will almost certainly never fully use. I guess many others will be the same but I’ve set out to start filling mine up.

50GB is a lot and I thought that the best way would be to fill it automatically, as I create/receive content, rather than uploading things manually. This set me off on the long trail of things, one being to automatically forward all my attachments to Dropbox - this seemed no easy task.

I’d been interested in [IFTTT](https://ifttt.com/) and had been using that to do lots of _similar_ things, that was my first stop. It seemed so close to being possible. There were a few crucial problems with the various recipes that I tried. The first problem is that Google don’t provide an attachment URL in the Gmail API. This created a second idea: forwarding to the IFTTT trigger address. But Gmail doesn’t allow you to forward to an unverified address and I had no way of verifying it. Next I tried forwarding the ‘attachmented’ mail to another of my personal addresses and then getting them to forward on to IFTTT (not all webmail needs verification for forwarding). This didn’t seem to work either as the mail seemed to retain it’s original address and wasn’t firing the trigger.

All in all this was a lot of work with _no_ results - it didn’t even work a little bit.

Before IFTTT I had briefly looked at the other options, there were quite a few but none seemed to be what I wanted. I did however make the mistake in brushing over [attachments.me](https://attachments.me/).

When I first looked at this it only seemed to enable you to _selectively_ forward attachments to Dropbox, how wrong I was. If I’d taken the time to look a little closer I would have found that it can, in fact, automatically forward all attachments too.

I’d spent hours trying to build my own way to do this with IFTTT, assuming that there must be a way - it seems there isn’t. The thing that is interesting though is that _attachments.me_ must be using the Gmail API too, just as IFTTT does - I would pay to know how on earth they got that working!
