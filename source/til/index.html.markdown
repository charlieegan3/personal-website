---
noindex: true
---
A list of things I learnt that I remembered to note down.

## 2017

* Websockets are not supported on phantomjs <v2 _(17th March)_
* You need to keep the google site verification TXT records in place. _(16th March)_
* You need to use an Application Load Balancer if you're using websockets. _(16th March)_
* A little about how systemd-boot works and how to the files in an EFI partition link up with a Linux installation. _(3rd February)_
* How to write a simple Ruby gem built on Rust with RuRu. _(27th Janurary)_

## 2016

* Using Postgres jsonb appears to be faster than using ActiveRecord's serialized attributes. _(14th October)_
* Local notifications have changed in iOS 10 to UserNotifications. Also, testing background "Significant" location change events in an iOS app isn't trivial. _(7th October)_
* `|(a || 0) + 1 => a undefined` but `|a = (a || 0) + 1 => 1` _(30th September)_
* That the rails snowman parameter was a thing and that it was ensure IE correctly parsed parameters. _(23rd September)_
* What Concerns are (in the context of Rails) and object orientation can take many forms. _(16th September)_
* There are all sorts of different kinds of container for different use cases. Via Container Camp conference. _(9th September)_
* Docker containers cannot link to non-running containers. This requires use of Docker networking. _(19th August)_
* HAML has some strange syntax, like !!!5 for an HTML5 DOCTYPE. _(12th August)_
* Docker port vs. expose. Also, how mapping syntax works e.g. why "30000-30009" is not the same as "30000-30009:30000-30009" _(5th August)_
* Ruby objects have an "Eigenclass"; the behavior of which can be adjusted. _(2nd August)_
* Docker for Mac has file system events, dlite & docker-machine don't. _(27th July)_
* Middleman auto-reloads scss - but not markdown files. _(15th July)_
* There is no API endpoint to get Facebook notifications (any more). _(June)_
