---
layout: post
title: Rural Broadband
date: '2013-05-04T01:02:15+01:00'
tags:
- broadband
- rural broadband
- ping
- latency
- bt
- ISP
- phone coop
- SNL
- Xbox
- Skype
- internet access
- internet connection
tumblr_url: http://charlieegan3.tumblr.com/post/49549258257/a-story-of-rural-broadband-we-were-relatively
---
We were (relatively) late to get round to broadband - it would have been around 2009 I think. I should start by explaining the situation. We live 4.85 miles from the exchange - this means that we _can actually get_ broadband. Many near us can’t get a DSL line and need to use other solutions. So in terms of signing &amp; setting up we’ve had no issues.

So we first signed up with AoL - only to leave within weeks due to customer support issues. Then we were with BT for a few years, things worked perfectly - we enjoyed a good rate of 4.2Mbps. The quality was also good with an average ping of 50ms, jitter of around ±3ms and never any packet loss. All was well and good.

However - in late 2011 we changed to ‘The Phone Coop’, now 'the cooperative broadband’. I was told over the phone that the line would be **exactly** the same - sadly it wasn’t. I wasn’t into Xbox at the the time and there wasn’t really any need for Skype calls either - this meant the issue went largely unnoticed for months. I only got round to properly testing it last summer, the connection was horrendous. The ping varied largely during the day, in the morning it was similar to our older connection, in the evening it was abysmal. The ping rocketed to around 400ms on average and the jitter was through the roof too. The total bandwidth was sound, only the quality was different.

I spent a long time corresponding with the Phone Coop’s tech support, which were by the way, top notch. I sent around 90 emails, three cases of around 30 emails. Though it took a long time to get things done as they do it all through other providers and need BT to do anything at the exchange. I wrote special programs to gather data about the connections quality - it was what seemed to be needed as proof. I even got a short ban from Google because I was pinging them o much! After some time the signal to noise ratio of our line at the exchange was adjusted in an attempt to stabilise the line. It didn’t work however. I didn’t think it would, from my trace routes the slow stages were within their network - their service was the slow part it seemed. In the end I decided that my location was somehow giving me a lower priority on their network, or it was going through more steps to get to any kind of destination. This was what seemed to be causing the problem. And to fix this I needed to change ISP - back to BT was our best bet.

We left The Phone Coop on the 17th of April 2013. They were great to deal with from start to end, their customer service was also great - it’s just the setup that didn’t cut it on a rural line. Everything is fine now with BT, the bandwidth is less, around 3Mbps, however the line is much more stable than any other domestic line i’ve seen. My guess is that this is because of the SNL adjustment made by The Phone Coop. Now the ping is around 30-40ms, with a max jitter of 1ms. So yeah, I’m happy.

I guess the lesson at the end of the day is: If your exchange doesn’t have LLU or you live any distance from the exchange then be very careful about your choice in ISP. It’s a shame that The Phone Coop didn’t work for us, this means, if others go to the extent of investigation that I did (which few will), that they will always end up with BT. So despite opening up the industry, in rural communities for now at least, BT still has a monopoly on a quality line.

-charlie out-

