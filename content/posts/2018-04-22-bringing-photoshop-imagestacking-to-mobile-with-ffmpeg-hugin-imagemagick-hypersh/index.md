---
aliases:
- /blog/2018/04/22/bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh
title: "Bringing Photoshop image-stacking to mobile with FFmpeg, Hugin, ImageMagick & Hyper.sh"
date: 2018-04-22 22:50:55 +0100
---

**Update** _You can try the project [here](https://charlieegan3-stackr.herokuapp.com/). Code available [here](https://github.com/charlieegan3/stackr)._

**Update 2** I have taken down the live demo - there are now many apps that make this easy on phones.

## Intro

At the end of last year I started paying for a Creative Cloud subscription so
that I could use the [Adaptive Wide-Angle Filter](https://helpx.adobe.com/photoshop/using/adaptive-wide-angle-filter.html)
to correct distorted images taken with my [Moment Superfish Lens](https://www.shopmoment.com/shop/new-superfish-lens)
and play with [image stacking](https://helpx.adobe.com/photoshop/using/image-stacks.html)
to take more interesting night-time shots.

While the Adaptive Wide-Angle in Photoshop is really well implemented, (Example
[before](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/lens_distorted.jpg)
and
[after](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/lens_corrected.jpg))
I found that with the
[SKRWT](http://www.skrwt.com/) 'suite' of apps I could get much the same result
from using just my phone.

However, I've been unable to find an app that does image stacking on Android.
This is a stacked-edit from Photoshop using photos taken on my phone over
Christmas. Note the stars and roads in the distance.

[
  ![stacked image from photoshop](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/photoshop_stacked.jpg)
](https://photos.charlieegan3.com/photos/2017-12-29-1680667219972842009/)

I'd love to be able to create images like this without needing to sit down and
wait for Photoshop as well as various uploads and downloads to Dropbox in
between.

I'm opposed to using Photoshop in my 'workflow' for the following reasons:

- I need to use my laptop, often this means uploading many photos and loading
  them into a stack takes ages.
- It is not free
- Pouring over Photoshop for hours on your laptop is hardly in the spirit of
  "the best camera is the one you have with you"

So with SKRWT covering my Adaptive Wide-angle needs I set out to create a
tool for image stacking I could use from my phone.


## Fundamentals

At the most basic level I need to be able to turn videos into stacked stills
with the option of tuning various parameters (I can turn sets of images into
videos on my phone if need be - Google Photos to create an Animation, then GIF
to MP4).

You can do this with the following commands:

```
ffmpeg -i video.mp4 -r $FPS -f image2 frame_%07d.png
convert frame_* -evaluate-sequence mean stacked.jpg
```

Sometimes I also need to align the stills picked from the video:

```
ffmpeg -i video.mp4 -r $FPS -f image2 frame_%07d.png

if [ "$ALIGN" = true ] ; then
	align_image_stack -m -a aligned_ frame_*
	convert aligned_* -evaluate-sequence mean stacked.jpg
else
	convert frame_* -evaluate-sequence mean stacked.jpg
fi
```

It'd also be nice to use more of the evaluate-sequence modes:

```
MODE=median
MODE=min
MODE=max
convert frame_* -evaluate-sequence $MODE stacked.jpg
```

I tested this out on my laptop and it worked well enough. Aligning the images
was slow but it takes forever in Photoshop too.

This is the easy bit though. Next I needed to work out how to run this from my
phone.

## I called my thing stackr

From the commands above I knew I needed FFmpeg, Hugin and ImageMagick. I also
knew that I couldn't run this on Heroku because of timeouts. Similarly, it's
awkward to run on Lambda as sometimes a job might take over 5 minutes to
complete.

What I needed was to be able to run an arbitrary container with some params.
Hyper.sh to the rescue!

I'd recently enjoyed using Hyper.sh to [automate my photo
website](/posts/2018-04-07-i-made-an-interactive-portfolio-site-with-hugo)
and thought it'd work well here too - mainly because containers can run for as
long as required.

I also needed to run a frontend that could handle the video uploads and present
the options form. I decided to just run this as a sinatra app on Heroku - using
what I knew best in the hope of just getting something working.

This is what it looked like by the time I had an MVP. First upload a video with
frames to use in the stack. Choosing the mode, whether to auto align images and
FPS at the same time.

![form](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/form.png)

Next, something like this happens:

![system diagram](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/diagram.png)

Using a bucket to store the video, the Heroku app spawns a container to
generate the stacked image. When it's done, it sends me a notification with
[Pushover](https://pushover.net/).

With this I can quite easily experiment with different stack modes from my phone
- and with minimal battery impact too.

## Some Examples

I've been inside all weekend so I've got to draw from my past videos for this
bit. I only keep the stacked image - not the all the source images.

Standard blurring out the motion of the waves example:

![gun](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/gun.jpg)
[Source Video](https://photos.charlieegan3.com/photos/2016-05-29-1261099882943047095/)

Stacking is also good for removing people from busy shots:

![crowd](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/crowd.jpg)
[Source Video](https://photos.charlieegan3.com/photos/2014-10-22-836785782090590192/)

These are both pretty poor quality videos taken on a Galaxy Note II. Here's one
of a plane coming in to land at Heathrow this afternoon. No tripod, 4k, pixel 2.
(Click for full-size)

[
![4k](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/4k.jpg)
](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/4k.jpg)
[Source Video](https://photos.app.goo.gl/9tvOK7kZRoKtke9p1)

Or one from a video I took on the way to work:

[
![4k](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/church.jpg)
](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/church.jpg)
[Source Video](https://photos.app.goo.gl/jl985Kju1IuqPtX32)

This one's based of a short video waiting for the lights in putney, just
holding it in my hand.

[
![4k](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/putney.jpg)
](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/putney.jpg)
[Source Video](https://photos.app.goo.gl/yEZkWcx0NK2VgXIs2)

You can also create some more unusual ones:

[
![4k](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/trainblur.jpg)
](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/trainblur.jpg)
[Source Video](https://photos.app.goo.gl/zTSZhgbvMN90K02c2)

Sometimes it's not always best to attempt to align the shots!

[
![4k](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/art.jpg)
](/posts/2018-04-22-bringing-photoshop-imagestacking-to-mobile-with-ffmpeg-hugin-imagemagick-hypersh/art.jpg)
[Source Video](https://photos.app.goo.gl/zTSZhgbvMN90K02c2)

## How can I get it?
If you're interested to try this out let me know and I can let you in. I'm
keeping the site private as each upload as the potential to incur a cost.

I expect to post the code on GitHub in the next day or so.
