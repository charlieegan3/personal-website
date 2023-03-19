---
title: |
  Week 8
date: 2020-10-18 00:00:00 +0000
aliases:
- /posts/2020-10-18-week-notes-8/
- /week-notes/2020-10-18-week-notes-8/
---

- This week at work I've been setting up a new service that takes events from [Google Cloud PubSub](https://cloud.google.com/pubsub/docs/overview). There is a [local emulator](https://cloud.google.com/pubsub/docs/emulator) for the service - but when I tried using it it appeared to create real messages in my project, hmm. Anyway, this is something new and it seems to be a pretty simple API to build against with all the features we needed anyway (dead letter topic, long Ack deadline among others).
- Having had nearly two weeks off running (at least a week longer than I should have taken) I went for a [rather feeble](https://www.strava.com/activities/4210043978) 20 minute potter round the 'race track' where I'd been running pretty heavy intervals just a month or so ago... Sad times but it was a nice reminder of how much I enjoy running and that it's important, when reducing training intensity, to go close to zero, but not to stop completely for very long.

  I managed to go for [my weekly swim](https://www.strava.com/activities/4205351355), even colder, but felt more manageable. Thankfully the pool seems to be pretty quiet now.
- I collected the keys for my new flat. I move in tomorrow. I made curry for me, my now ex-flatmate and my three lovely nieghbours as a parting gift. I'm only moving 20 minutes away, to Dartmouth Park from Upper Holloway.
- I downloaded the new Black Ops Cold War beta this weekend. The movement generally feels more fluid and aiming seems *very* snappy, perhaps too much so? I found it fun to dip my toes in the latest and greatest in the world of Call of Duty but after a few hours found it to be much the same as it always. I find Warzone to be a much more interesting proposition and while it's a common genre now, it's not something I've personally played much of. I'm still unsure what the reason is that I find it so compelling - the variety, the different strategies, the huge map, the concept and memories of the Battle Royale film!?

  According to the stats I get 1 kill per game on average - but I love it!
- I have not achieved much this week in terms of side projects. I spent the little time I did have trying to run the `GoInstallBinaries` command from vim-go in a script. For some unknown reason [this](https://github.com/charlieegan3/linux-environment/commit/80c8ce0b8d3b3f485d82c50b858708400ea4a1b2#diff-04f5113744c41f945da359c370e2f8fdf96db6b8ca59617b068dc9461b79c7edR47) doesn't work. I think something is causing vim to fail, then for the command to sit and wait for input rather than fail with an exit code. This doesn't appear in the log however, and with little patience left at this point I opted to install the tools [using go get](https://github.com/charlieegan3/linux-environment/commit/46c2e970cb1616aacaacb4608ec53d69d8a64d9b) myself. Pain.
