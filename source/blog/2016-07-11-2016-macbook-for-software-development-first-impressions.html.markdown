---
title: "2016 Macbook for software development: First Impressions"
date: 2016-07-11 01:22 UTC
---

I had [a little trouble with my 2012 rMBP](/blog/2016-06-24-getting-a-full-refund-for-a-faulty-macbook-under-uk-consumer-law.html) and chose an m7 Retina Macbook as a replacement - after reading positive comments about the performance. I was looking for a different type of machine; namely something more portable; in line with travel plans of the upcoming year. I wanted to find out if the Macbook could do the job.

## My Setup
I use docker for development; via dlite. I use iTerm and use vim as my main editor. I do not install any additional runtimes or development tools beyond git and my editor to the Macbook itself. I have not installed Xcode (but have the CLI tools installed). I use Safari as my browser, though I have Chrome installed for the occasion when I'm doing something with a frontend focus.

You can get a better feel for my setup from my [Brewfile](http://github.com/charlieegan3/dotfiles/blob/master/Brewfile).

## Docker
Docker works really great and I've yet to notice a task that runs noticeably faster on my old Macbook Pro. This system continues to be a nice way to isolate projects and is a system that the Macbook seems to be very capable of hosting.

## Keyboard
At first I found the keyboard odd - I had tried it in the store but it's hard to get a real feel when typing all at the wrong angle. It takes 3-4 days of heavy use to fully 'get it' - or at least it took me that long. I'm not going to lie; it is different and I'm sure not for everyone. I personally have grown to really like the feel.

If I had a complaint to make it'd be that it's a little louder.

## Charger Bonus
I miss the MagSafe adapters of old, that said, perhaps the move towards something of a charging standard is a good thing. There is a bonus, with the USB-A/C adapter I can charge all my devices from the same wall adapter. Swapping the 65w and iPhone adapters for a smaller USB-C charger seems like a good deal.

## Screen
I find the screen plenty large enough to be productive in my editor and terminal. I find the Safari developer tools a little fiddly.

## Battery and Usage
I get around 6/7hrs out of the battery. I don't know what the average or advertised figures are but this seems pretty good to me. Being smaller, I'm been using the laptop more like an iPad in that it's always on or in sleep. I don't bother turning it off like I did with my old laptop. Being less... imposing on trains and in public places; coupled with being always on has made a big difference in convenience.

## Outstanding Issues
Safari seems to lag when using `cmd+L` to focus the address bar - this originally seemed to be fixed by disabling all the 'smart' features associated with the address bar and moving to an empty new tab page. However, the issue seems to have returned. I fear there is a network request (with a short but noticeable timeout) triggered on a UI blocking thread on this action. There seems to be very little I can do about this and it was present on my last machine too. I could perhaps investigate the request (if any) and block it in hosts.

There are sometimes minor graphical slowdowns. These have never lasted over a second and are not an issue for me at all. Such issues seemed to be most common when using the Photos application.

While the battery lasts very well the time to recharge is quite slow (And it's missing MagSafe...).

## Responses to problems reported by others

* I haven't noticed any throttling as described by commenters on r/Apple and MacRumors. I don't really do any very long running encoding or compilation tasks so I guess this perhaps not all that surprising.
* I have music playing most of the time playing from the Spotify desktop client. It seems that any issues once present have been fixed and using the application in this way seems to cause no issues - overheating or otherwise.

***

In conclusion; it seems I got lucky - in that the laptop, for me, is a good fit. It's not perfect, but, so far, it's been all I could have hoped for. It's a real shame the 2015 model under-powered planted this under-powered idea. I am of the opinion that it's common to go more than a little overboard on laptop specs (I know I did with my 2012 BTO rMBP). You don't need a dedicated GPU to be a productive web developer. There are downsides (heat and battery consumption) to higher spec components. Go try a Macbook, at least they're out and available.
