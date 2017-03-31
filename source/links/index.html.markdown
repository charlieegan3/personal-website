Originally this was just a list of articles - more recently this lists
my submissions of articles, tools or stories to the
[unboxed weekly roundups](https://unboxed.co/blog/culture/).

## 2017

[Modules vs.
microservices](https://www.oreilly.com/ideas/modules-vs-microservices) - A
discussion about building modular systems that articulates the costs of
microservices for modularity's sake.

[Rerere Your Boat...(2010)](https://git-scm.com/blog/2010/03/08/rerere.html) -
An explanation of the hidden `git rerere` feature that, using information about
previously resolved conflicts, can help make conflict resolution during merges
and rebasing easier.

[deep-photo-styletransfer](https://github.com/luanfujun/deep-photo-styletransfer)
- This is a cool project that puts one image in another (massive
oversimplification?) - and in a much more pleasing way than the convolutional
network [generated images](http://i.imgur.com/6ocuQsZ.jpg). Seems to need CUDA
and various other dependencies but it'd be good to get this running sometime.

[Git Standup](https://github.com/kamranahmedse/git-standup) - It's often helped
to remind yourself of what you were doing yesterday before standup. This is a
simple git extension that prints out each commit from the day before; it can
also jump back a number of days with `git standup -d 3` for checking on a
Monday morning.

[Stackoverflow Developer
Survey](https://stackoverflow.com/insights/survey/2017) - Thought it was worth
posting this; some interesting bits in there (Rust and Smalltalk as 'most
loved'; developers using Windows - even if there's likely to be something of a
.Net skew)

[Cargo
Check](https://github.com/rust-lang/cargo/blob/d8159308bde4f3a3ad20a67fb80a6956a64d91d2/src/bin/check.rs#L9)
- Rust 1.16 was [announced
yesterday](https://blog.rust-lang.org/2017/03/16/Rust-1.16.html) with various
interesting changes. `cargo check` is a tool to validate the correctness of a
program is now built into Cargo; Rust's build system and package manager. Cargo
check is interesting as it saves time by not building the program's binary.
Coupled with Rust's compiler messages I thought this sounded pretty useful.

[Scrimba](https://scrimba.com) - I spent a few innovation days playing with
various container-based continuous deployment tools last year. I played with
both [Wercker](http://www.wercker.com) and [Distelli](https://www.distelli.com)
but found both had their quirks when deploying to a GCE cluster. I've yet to
play with GCCB but hopefully better ease of use will come from the closer
integration.

[What makes WebAssembly
fast?](https://hacks.mozilla.org/2017/02/what-makes-webassembly-fast) - While
this is really about WebAssembly, there's also quite a bit in here about how
Javascript is executed by browsers and why parsing and decoding steps - as well
as missing type information - make it slower than running WebAssembly. It's
part of a series but I hadn't read the others and found it to be quite
accessible. Also worth stopping by
[caniuse.com](http://caniuse.com/#search=WebAssembly) for a reality check!

[webshit weekly](http://n-gate.com/hackernews/) - Weekly satirical summaries of
the distracted Hacker News hive mind - almost as good as this [amazing parody
thread](http://bradconte.com/files/misc/HackerNewsParodyThread/) from a few
years ago...

[Graphical depiction of ownership and borrowing in
Rust](https://rufflewind.com/2017-02-15/rust-move-copy-borrow) - I know this is
kind of specific but I also know I'm not the only one here that's interested in
[Rust](https://www.rust-lang.org). It's also a really good diagram for
something that's not easily understood. There's even a [PDF
version](https://rufflewind.com/img/rust-move-copy-borrow.pdf) for making
posters to spread the good word.

[Here's What TfL Learned From Tracking Your Phone On the
Tube](http://www.gizmodo.co.uk/2017/02/heres-what-tfl-learned-from-tracking-your-phone-on-the-tube/)
- Setting any privacy concerns aside; I think these results from tracking
passengers around the tube network is really interesting. TFL took efforts to
protect privacy and make passengers aware (I noticed the posters). As well as
the larger 'traffic flow' maps; there's also a plan drawing of a station with
journey times annotated.

[Persona Spectrum](https://twitter.com/nikmd23/status/808409344840712197) - I
thought this was a nice diagram, it's part of the Inclusive Design Toolkit and
makes a point about the wider value of building accessible websites.

[Sites can fingerprint you accross multiple
browsers](https://arstechnica.co.uk/security/2017/02/now-sites-can-fingerprint-you-online-even-when-you-use-multiple-browsers/)
- By getting browsers to perform tasks that give away attributes of the host
machine, it's possible to track the same device across sessions from multiple
browsers. Tasks make use of the GPU and the installed fonts among other
features to build profiles.

[Servo Starters](https://starters.servo.org/) - An idea for an upcoming Hackday
was to work on some open source projects. The Rust community & Mozilla have a
number of initiatives for new contributors. _Servo Starters_ is one such
initiative for the servo browser engine that lists issues suitable for
beginners as well as highlighting mentored.

[Scale API](https://www.scaleapi.com/) - Not sure if anyone else has used
[Amazon Mechanical Turk](https://www.mturk.com/mturk/welcome) before but this
is a similar service for "intelligence as a service" with a nice API (that I
haven't used yet). There's also an [SE Daily
episode](https://softwareengineeringdaily.com/2016/12/16/scale-api-with-lucy-guo-and-alexandr-wang/)
with an interview for those into podcasts.

[Static Site Generators](https://staticsitegenerators.net/) - A static site
generator for every language. I feel like I missed someone influential claiming
static site generators are literally _the best_ side project ever. Good list
nonetheless.

[awesome-bits](https://github.com/keon/awesome-bits) - Another (more awesome)
list. Basically it's a write up of bit wise operations of varying complexity,
most of the simple ones work in Ruby too.

[C++ Compiler Explorer](http://godbolt.org) - This is a cool project that
interactively shows, for a given C++ program, the resulting Assembly Code. It's
also interesting to see the difference compiler optimizations make, e.g.
[without](https://godbolt.org/g/9DYQmF) vs.
[with](https://godbolt.org/g/JEULQ5)

[Where's Susi? Airborne Orangutan Tracking with Python and
React.js](https://dirkgorissen.com/2016/04/19/wheres-susi-airborne-orangutan-tracking-with-python-and-react-js/)
- This is a side project that produced a fully automated drone for gathering
data on the location of rehabilitated Orangutans. (This project was subject of
the opening talk of HNLondon this week)

[Squib](http://squib.rocks) - I spent a [recent
Hackday](https://unboxed.co/blog/unboxed-hackathon-2-all-in-an-innovation-day-s-work/)
working on a simple app to generate art for playing cards. Squib is a ruby DSL
for generating & laying out cards - looks like a cool project.

[Invisible Captcha](https://github.com/markets/invisible_captcha) - Simple gem
for unobtrusive spam rejection in Rails. We rolled our own version of this in a
  recent project but it's something that would be nice to reuse on other public
  forms.

[Stack Overflow Developer Survey 2017](https://www.surveymonkey.com/r/92SGNSF)
- Each year stackoverflow asks lots of questions to lots of developers and does
a nice write up of the results. Last year they had over 50k responses & did a
nice write up of the results
[here](http://stackoverflow.com/research/developer-survey-2016).

## 2016

[The Cloudcast #281 - Monoliths and
Microservices](http://www.thecloudcast.net/2016/12/the-cloudcast-281-monoliths-and.html)
- An interview with [Anders Wallgren](https://twitter.com/anders_wallgren) with
a more balanced take on the Monolith vs. Microservices discussion. The take
away for me was that 'monolith problems' often stem from process or
organizational culture and that microservices can't fix that.

[Textures.js](http://riccardoscalco.github.io/textures/) - I've had various
interesting discussions with [petition map Cale](https://twitter.com/tlfrd)
about heat-maps, cartograms and choropleths and how colour can introduce bias.
Maybe textures would work better?

[A list of programming languages that are actively developed on
GitHub](https://github.com/showcases/programming-languages) - The title really
should be "A list of programming languages with a GitHub repo." since a number
of these are mirrors - still, it's nice to see this extension to the GitHub
Explore page.

[semantic-rs](https://github.com/semantic-rs/semantic-rs) - Earlier in the year
I wrote up a [sub-graph matching package](https://crates.io/crates/graph_match)
in Rust. Published packages (crates) require the version to be set correctly;
I'd done this manually and it's just another thing to remember to do. I haven't
used semantic-rs but it looks pretty useful for helping automate the process.
I've not yet come across an equivalent for Ruby.

[Finding The Fake-News
King](http://www.npr.org/sections/money/2016/12/02/504155809/episode-739-finding-the-fake-news-king)
- Short podcast episode about fake news that includes an brief interview with
someone running a number of fake news sites. Interesting to hear the story from
the other side. The interview is written up
[here](http://www.npr.org/sections/alltechconsidered/2016/11/23/503146770/npr-finds-the-head-of-a-covert-fake-news-operation-in-the-suburbs).

[LessPass: Next-Gen Open Source Password Manager](https://lesspass.com) - Even
if AES-256 has so far proven unbreakable; maybe we don't need to store
  passwords at all. LessPass uses a combination of the domain; username and
  master password to re-generate your password each time it's required. There's
  also an optional, self hosted encrypted password store for passwords and a
  cool emoji-hash indicator to make sure you're entering your master password
  correctly ([see
  here](https://d262ilb51hltx0.cloudfront.net/max/800/1*wgrq2WIxhyBSfL1Tbr5Qbw.gif)).

[My fight against CDN
libraries](http://peppercarrot.com/article390/my-fight-against-cdn-libraries) -
A short write up of some alternatives to _consider_ before reaching for that
CDN library & it's associated privacy concerns.
[Discussion](https://news.ycombinator.com/item?id=13075199)

[IronFunctions](https://github.com/iron-io/functions) - Disclaimer; I haven't
used this yet. The project is means of setting up DIY functions as a service.
It looks like it's pretty easy to setup and that it ought to be possible to run
super cheaply on
[hyper.sh](https://console.hyper.sh/register/invite/leKWeNqqKgh9RJxM0Mm3T8d27GKJ3qUL)
(that's my referral link - gets us both some free credits). It runs functions
in containers so how you write your functions is pretty flexible.

[12 Fractured Apps
(2015)](https://medium.com/@kelseyhightower/12-fractured-apps-1080c73d481c) - A
short & accesible write up about writing resilient applications. While it uses
containerized apps as an example, the ideas about handling interactions with
the environment are more generally applicable. If you're interested in
containers, Kelsey Hightower has a lot of interesting project and tutorials on
his [GitHub](https://github.com/kelseyhightower?tab=repositories) Profile.

[(Discussion Thread) What simple tools or products are you most proud of
making?](https://news.ycombinator.com/item?id=12957371) -
followww.co](https://followww.co/) - visualises redirects and cookies set along
the way; * [launchaco.com](http://launchaco.com/) - a faster more complete
domainr * [imguru](https://github.com/FigBug/imguru) - uploads images to Imgur
from the command line * [transfer.sh](https://transfer.sh) - a simple CLI for
file transfers.

[Why We Chose Turbolinks](https://changelog.com/posts/why-we-chose-turbolinks)
- From a podcast regularly interviewing people making the latest cool thing
this was an interesting read about the state of Turbolinks and why they chose
it for the new Changelog site.

[Rails Docker App Deployment on
Kubernetes](http://www.eggie5.com/82-rails-docker-app-deployment-kubernetes) -
I went through a this on an innovation day a few weeks ago but never wrote it
up. If you're interested in running a containerized Rails app in a mock
production setup then this is one way to do it. The [previous
post](http://www.eggie5.com/81-rails-docker-app) has a Docker development Rails
quick start guide.

[EA Games and Origin quietly bans an entire country - or, why you shouldn't
take digital distribution for
granted.](https://www.reddit.com/r/gaming/comments/5a51e2/ea_games_and_origin_quietly_bans_an_entire/)
- A good long list of all the things you can get away with - most of the time.

[Static typing will not save us from broken
software](http://www.drmaciver.com/2016/10/static-typing-will-not-save-us-from-broken-software/)
- I think this is an interesting topic. This is a writeup of the tradeoffs of
static typing & automated testing. I think one key point is that it's often
easier to cover a bug that made it into the wild with a test than model it in a
type system. There's also a good discussion over on [Hacker
News](https://news.ycombinator.com/item?id=12774024).

[Playing Overwatch on Azure's new monster GPU
instances](http://lg.io/2016/10/12/cloudy-gamer-playing-overwatch-on-azures-new-monster-gpu-instances.html)
- Need a quick summary of all the places you're logged in? Try this handy
vulnerability(?).

[Why Podcasting Still Needs
RSS](https://about.radiopublic.com/why-podcasting-still-needs-rss-6a2779e94e96)
- A post about building on an existing standard - rather than replacing it with
a propriety one (as various other podcast services are doing).

[How could banks with multiple branches work in a world without quick
communication?](http://worldbuilding.stackexchange.com/questions/57014/how-could-banks-with-multiple-branches-work-in-a-world-without-quick-communicati)
- This stackexchange site has [loads of interesting
questions](http://worldbuilding.stackexchange.com/questions?sort=votes). This
is a good one from this week about banking and systems of trust. The answers
have interesting parallels with TransferWise, cryptocurrencies and the like.

[Running Online Services at
Riot](https://engineering.riotgames.com/news/running-online-services-riot-part-i)
- While perhaps a little long, it raises some interesting points about what
object orientation really means.

[Five Months of
Kubernetes](http://danielmartins.ninja/posts/five-months-of-kubernetes.html) -
Continuing yesterday's AWS theme; this looks like a good write up of Kubernetes
on AWS. I'm thinking trying out
[kube-aws](https://github.com/coreos/coreos-kubernetes/tree/master/multi-node/aws)
(the tool mentioned in the article) this weekend.

[Slack's Architecture with Keith
Adams](http://softwareengineeringdaily.com/2016/09/12/slacks-architecture-with-keith-adams/)
- Not sure how keen everyone is on podcasts but if you've ever wondered how
Slack fits together behind the scenes this is worth a listen. (As are many of
the other episodes for that matter)

[A Beginner's Very Bumpy Journey Through The World of Open
Source](https://medium.freecodecamp.com/a-beginners-very-bumpy-journey-through-the-world-of-open-source-4d108d540b39)
- I feel like there are lots of "open source: how to start" articles going
round but this seemed to place a greater emphasis on sticking at it and being
prepared  to try elsewhere if it doesn't work out.

[Examining The Internals Of The Rails Request/Response
Cycle](http://www.rubypigeon.com/posts/examining-internals-of-rails-request-response-cycle/)
- Our CTO thinks there's a little too much focus on the internal class names
which can change but it's useful for understanding how a request flows through
the Rails application and how Rails relies on Rack for a lot of that
functionality.

["fs" unpublished and restored](http://status.npmjs.org/incidents/dw8cr1lwxkcr)
- In responding to a flagged package, npm Inc. broke project builds that had
mistakenly required the bogus "fs" package rather than requiring the "fs"
module from Node.

[A Container Is A Function
Call](https://glyph.twistedmatrix.com/2016/08/defcontainer.html) - This
discusses our definition for containers and how Dockerfiles might be improved
with some additional, more-descriptive attributes.

[I Peeked Into My `node_modules` Directory And You Won't Believe What Happened
Next](https://medium.com/friendship-dot-js/i-peeked-into-my-node-modules-directory-and-you-wont-believe-what-happened-next-b89f63d21558)
- A funny story about what's lurking in our external dependencies.

[Professor Frisby's Mostly Adequate Guide to Functional
Programming](https://drboolean.gitbooks.io/mostly-adequate-guide/content/) -
I've been reading this over the last two weeks, so far it's been a good
introduction to functional concepts that didn't sink in when I'd covered them
in the past. It uses Javascript and Ramda library for the examples which are
easy to test out here in a browser [here](http://ramdajs.com/repl/?v=0.21.00).

---

*   [How to use Hyper.sh and AWS ECR to deploy a Hubot instance for less than $3 a month](https://hyper.sh/howto/how-to-use-hyper.sh-and-ecr-to-run-a-hubot-for-3-dollars-per-month.html)
*   [Sandstorm Uses Mega-Containerization to Offer Fine-Grained Access Control - The New Stack](http://thenewstack.io/sandstorm-uses-mega-containerization-offer-fine-grained-access-control/)
*   [ClojureScript saved me 100 hours](https://dev.to/buntine/clojurescript-saved-me-100-hours)
*   [What I learned leading Ops at GitHub, Heroku, DigitalOcean, and more...](http://www.slideshare.net/MarkImbriaco/what-i-learned-leading-ops-at-github-heroku-digitalocean-and-more)
*   [Ask HN: What simple tools or products are you most proud of making? | Hacker News](https://news.ycombinator.com/item?id=12957371)
*   [Guide | Dockerfiles Considered Harmful](http://blog.wercker.com/dockerfiles-considered-harmful)
*   [In 13 minutes from Kubernetes to a complete application development tool | GitLab](https://about.gitlab.com/2016/11/14/idea-to-production)
*   [Making Time for Side Projects: A Daily Habit](https://ponyfoo.com/articles/making-time-for-side-projects)
*   [Docker Container Anti Patterns](http://blog.arungupta.me/docker-container-anti-patterns)
*   [The Death of RSS - Long Live the Open Web](https://www.spinn3r.com/blog/2016/11/09/The-Death-of-RSS-Long-Live-Open-Web.html)
*   [Docker in Production: A History of Failure – The HFT Guy](https://thehftguy.com/2016/11/01/docker-in-production-an-history-of-failure/)
*   [EA Games and Origin quietly bans an entire country - or, why you shouldn't take digital distribution for granted. • /r/gaming](https://www.reddit.com/r/gaming/comments/5a51e2/ea_games_and_origin_quietly_bans_an_entire)
*   [Running containers without Docker - Julia Evans](https://jvns.ca/blog/2016/10/26/running-container-without-docker/)
*   [Deploying a Haskell application to AWS Elastic Beanstalk](https://medium.com/@folsen/deploying-a-haskell-application-to-aws-elastic-beanstalk-24c7c29d3a8f)
*   [12 Fractured Apps – Kelsey Hightower – Medium](https://medium.com/@kelseyhightower/12-fractured-apps-1080c73d481c)
*   [Unlocking Horizontal Scalability in Our Web Serving Tier – Airbnb Engineering & Data Science](https://medium.com/airbnb-engineering/unlocking-horizontal-scalability-in-our-web-serving-tier-d907449cdbcf)
*   [How I Became HackerRank #1 In Two Hours - williampross](http://williampross.com/became-hackerrank-1-two-hours/)
*   [Your Social Media Fingerprint](https://robinlinus.github.io/socialmedia-leak/)
*   [Why We Chose Turbolinks | Changelog](https://changelog.com/posts/why-we-chose-turbolinks)
*   [Cloudy Gamer: Playing Overwatch on Azure's new monster GPU instances](http://lg.io/2016/10/12/cloudy-gamer-playing-overwatch-on-azures-new-monster-gpu-instances.html)
*   [awesome-falsehood/README.md at master · kdeldycke/awesome-falsehood · GitHub](https://github.com/kdeldycke/awesome-falsehood/blob/master/README.md)
*   [hellerbarde/latency.markdown forked from jboner/latency.txt Created May 31, 2012](https://gist.github.com/hellerbarde/2843375)
*   [I just want to run a container! - Julia Evans](http://jvns.ca/blog/2016/10/02/i-just-want-to-run-a-container/)
*   [Why Podcasting Still Needs RSS](https://about.radiopublic.com/why-podcasting-still-needs-rss-6a2779e94e96)
*   [Ask HN: Opposite of not invented here? | Hacker News](https://news.ycombinator.com/item?id=12662767)
*   [A polyglot architecture – Skyscanner’s frontend under the hood – Code Voyagers](http://codevoyagers.com/2016/02/03/a-polyglot-architecture-skyscanners-frontend-under-the-hood/)
*   [My adventures in Rust webdev](https://medium.com/@tomaka/my-adventures-in-rust-webdev-850c67be6c40)
*   [Google Cloud Platform Blog: Bringing Pokémon GO to life on Google Cloud](https://cloudplatform.googleblog.com/2016/09/bringing-Pokemon-GO-to-life-on-Google-Cloud.html?m=1)
*   [Running Online Services at Riot: Part I | Riot Games Engineering](http://engineering.riotgames.com/news/running-online-services-riot-part-i)
*   [Retracing Original Object-Oriented Programming – skyfishtech](https://medium.com/skyfishtech/retracing-original-object-oriented-programming-f8b689c4ce50)
*   [Some thoughts on code review – Sauve qui peut!](http://blog.davidablack.net/2016/09/27/some-thoughts-on-code-review/)
*   [Don't Call Yourself A Programmer, And Other Career Advice | Kalzumeus Software](http://www.kalzumeus.com/2011/10/28/dont-call-yourself-a-programmer/)
*   [Monzo – Building a Modern Bank Backend](https://monzo.com/blog/2016/09/19/building-a-modern-bank-backend/)
*   [How We Got Here with Cory Doctorow](http://5by5.tv/changelog/221)
*   [A Review of Immutability in Ruby](https://blog.codeship.com/a-review-of-immutability-in-ruby/)
*   [Go Walkthrough: fmt – Go Walkthrough](https://medium.com/go-walkthrough/go-walkthrough-fmt-55a14bbbfc53)
*   [I gave commit rights to someone I didn't know, I could never have guessed what happened next! · Jakewins](http://jakewins.com/p/clickbait)
*   [We Don’t Simply Get Remote Jobs, We Join Remote Teams | Hacker News](https://news.ycombinator.com/item?id=12510609)
*   [Lessons learned from using Docker Swarm mode in production | Hacker News](https://news.ycombinator.com/item?id=12508711)
*   [Five Months of Kubernetes – Daniel Martins](http://danielmartins.ninja/posts/five-months-of-kubernetes.html)
*   [An Ode to Boring: Creating Open and Stable Container World](https://medium.com/@bob_48171/an-ode-to-boring-creating-open-and-stable-container-world-4a7a39971443)
*   [golang-notes/OOP.md at master · luciotato/golang-notes · GitHub](https://github.com/luciotato/golang-notes/blob/master/OOP.md)
*   [Learning something? Here's why you should think small](https://www.jagtalon.com/learning-something-heres-why-you-should-think-small/)
*   [Ask HN: Is web programming a series of hacks on hacks? | Hacker News](https://news.ycombinator.com/item?id=12477190)
*   [Moving from Docker to rkt](https://medium.com/@adriaandejonge/moving-from-docker-to-rkt-310dc9aec938)
*   [In Defense of Cargo Cult Programming](https://www.promptworks.com/blog/in-defense-of-cargo-cult-programming)
*   [Alex Naraghi - What I Didn't Understand as a Junior Programmer](http://blog.alexnaraghi.com/what-i-didnt-understand-as-a-junior-programmer)
*   [Ask HN: How do you define a junior developer?](https://news.ycombinator.com/item?id=12557149)
*   [Introducing the GitHub Load Balancer - GitHub Engineering](http://githubengineering.com/introducing-glb/)
*   [Why we use progressive enhancement to build Gov.uk](https://news.ycombinator.com/item?id=12538144)
*   [Ask HN: How did you learn coding](https://news.ycombinator.com/item?id=12535635)
*   [A Beginner’s Very Bumpy Journey Through The World of Open Source](https://medium.freecodecamp.com/a-beginners-very-bumpy-journey-through-the-world-of-open-source-4d108d540b39)
*   [Ask HN: How Did You Escape 9 to 5?](https://news.ycombinator.com/item?id=12398290)
*   [GitHub - groob/goviz-frameworks: pretty pictures of web frameworks and applications](https://github.com/groob/goviz-frameworks)
*   [Two Years as a High School Mentor « null program](http://nullprogram.com/blog/2016/09/02/)
*   [Websocket Shootout: Clojure, C++, Elixir, Go, NodeJS, and Ruby | The Hashrocket Blog](https://hashrocket.com/blog/posts/websocket-shootout)
*   [And it's gone —The true cost of interruptions - JAXenter](https://jaxenter.com/aaaand-gone-true-cost-interruptions-128741.html)
*   [3 of my methods to grab quality backlinks | BlackHatWorld - The Home of Internet Marketing](http://www.blackhatworld.com/seo/3-of-my-methods-to-grab-quality-backlinks.873295/)
*   [Linux-toys.com » Blog Archive » The Sad State of Docker](http://www.linux-toys.com/?p=684)
*   [Keep a Changelog](http://keepachangelog.com/en/0.3.0/)
*   [How to make Slack less bad for you | Robert Heaton](http://robertheaton.com/2016/08/23/how-make-slack-slightly-less-bad-for-you/)
*   [Building the Image Grid from Google Photos](https://medium.com/@danrschlosser/linkedin-dark-patterns-3ae726fe1462)
*   [“Node.js is one of the worst things to happen to the software industry” (2012) | Hacker News](https://news.ycombinator.com/item?id=12338365)
*   [Serverless Architecture with Mike Roberts | Software Engineering Daily](http://softwareengineeringdaily.com/2016/08/23/serverless-architecture-with-mike-roberts/)
*   [garybernhardt/types.markdown Last active Sep 9, 2016](https://gist.github.com/garybernhardt/122909856b570c5c457a6cd674795a9c)
*   [What Golang Is and Is Not](http://danmux.com/posts/what_golang_isnt/)
*   [On technical debt (now with chickens!) | using (IMHO)](https://usingimho.wordpress.com/2012/02/27/on-technical-debt-now-with-chickens/)
*   [How Mashape Manages Over 15,000 APIs & Microservices - Mashape | StackShare](http://stackshare.io/mashape/how-mashape-manages-over-15000-apis-and-microservices)
*   [Functional Programming Techniques With Ruby: Part I](https://www.sitepoint.com/functional-programming-techniques-with-ruby-part-i/)
*   [Deciphering Glyph :: A Container Is A Function Call](https://glyph.twistedmatrix.com/2016/08/defcontainer.html)
*   [It might be worth learning an ML-family language | David R. MacIver](http://www.drmaciver.com/2016/07/it-might-be-worth-learning-an-ml-family-language/)
*   [GitHub - VerbalExpressions/RustVerbalExpressions: Rust Port of VerbalExpressions](https://github.com/VerbalExpressions/RustVerbalExpressions)
*   [How to Code for Fun Outside of Work](https://spin.atomicobject.com/2016/08/02/coding-for-fun/)
*   [Why I don’t want stuff | Derek Sivers](https://sivers.org/gifts)
*   [Comparing Scala to F#](http://mikhail.io/2016/08/comparing-scala-to-fsharp/)
*   [I Peeked Into My Node_Modules Directory And You Wont Believe What Happened Next](https://medium.com/friendship-dot-js/i-peeked-into-my-node-modules-directory-and-you-wont-believe-what-happened-next-b89f63d21558)
*   [Is Serverless architecture just a finely-grained rebranding of PaaS?](http://www.ben-morris.com/is-serverless-architecture-just-a-finely-grained-rebranding-of-paas/)
*   [Vendoring Dependencies in Go](https://www.meta.sc/tech/govendoring/)
*   [8 years working, now 3-4 months off to learn. Looking for advice](https://news.ycombinator.com/item?id=12259772)
*   [Coding For Fun - How to Avoid Creating a Second Job](https://spin.atomicobject.com/2016/08/02/coding-for-fun)
*   [To save the world, scripts/create_article.rbt get a job at a charity; go work on Wall Street](http://qz.com/57254/to-save-the-world-dont-get-a-job-at-a-charity-go-work-on-wall-street/)
*   [A Mathematicians Lament](https://www.maa.org/external_archive/devlin/LockhartsLament.pdf)
*   [From file-sharing to prison: A Megaupload programmer tells his story](http://arstechnica.com/tech-policy/2016/06/from-file-sharing-to-prison-a-megaupload-programmer-tells-his-story/)
*   [Static vs. Dynamic Is the Wrong Question for Working Programmers](http://www.craigstuntz.com/posts/2016-06-18-static-vs-dynamic-wrong-question.html)
*   [Example Driven Development](http://www.wilfred.me.uk/blog/2016/07/30/example-driven-development/)
*   [Outage Postmortem - July 20, 2016](http://stackstatus.net/post/147710624694/outage-postmortem-july-20-2016)
*   [The Royal We in Scientific Software Development](https://medium.com/@matthewturk/the-royal-we-in-scientific-software-development-9deea495b3b6)
*   [Ph.D. or Professional Programmer?](https://henrikwarne.com/2016/03/07/ph-d-or-professional-programmer/)
*   [Because Reading is Fundamental](https://blog.codinghorror.com/because-reading-is-fundamental-2/)
*   [I know how to program, but I don't know what to program](http://www.devdungeon.com/content/i-know-how-program-i-dont-know-what-program)
*   [How Great Programmers Avoid Bugs](http://www.zerobugsandprogramfaster.net/essays/4.html)
*   [Career/Job Advice and Observations](http://www.network-node.com/blog/2016/5/19/careerjob-advice-and-observations)
*   [Why Cruise Ships are My Favorite Remote Work Location](http://tynan.com/cruisework)
*   [Programmers are not different, they need simple UIs](http://antirez.com/news/107)
*   [It's the Future](https://circleci.com/blog/its-the-future/)
*   [Confused by testing terminology?](http://www.codewithoutrules.com/2016/02/27/testing-terminology/)
*   [Introducing our Hybrid lda2vec Algorithm](http://multithreaded.stitchfix.com/blog/2016/05/27/lda2vec/#topic=38&lambda=1&term=)
*   [Nine Common Dockerfile Mistakes (tip 3)](http://blog.runnable.com/post/145895165446/9-common-dockerfile-mistakes)
*   [A case against syntax highlighting](http://www.linusakesson.net/programming/syntaxhighlighting/)
*   [The Children's Illustrated Guide to Kubernetes](https://deis.com/blog/2016/kubernetes-illustrated-guide/)
*   [HN thread on the free software market](https://news.ycombinator.com/item?id=11926923)
*   [Facebook's new front-end server design](https://code.facebook.com/posts/1711485769063510/facebook-s-new-front-end-server-design-delivers-on-performance-without-sucking-up-power/)
*   [Its all her parent’s fault](http://irhadbabic.com/its-all-her-parents-fault/)
*   [Don’t Use “MVP” as an Excuse to Write Bad Software](http://dev.to/@ben/dont-use-mvp-as-an-excuse-to-write-bad-software)
*   [Your just considered harmful](https://medium.com/@boennemann/your-just-considered-harmful-679db7366b95)
*   [A Decade Of Container Control At Google](http://www.nextplatform.com/2016/03/22/decade-container-control-google/)
*   [Watch Paint Dry](https://medium.com/swlh/watch-paint-dry-how-i-got-a-game-on-the-steam-store-without-anyone-from-valve-ever-looking-at-it-2e476858c753)
*   [On Functional Programming](https://medium.com/@jlouis666/on-functional-programming-df28cc9078de)
*   [Naming is abstraction](http://benlakey.com/2016/04/29/naming-is-abstraction/)
*   [Human Git Aliases](http://gggritso.com/human-git-aliases)
*   [So what is a “pure programming language” anyway?](http://researchblogs.cs.bham.ac.uk/thelablunch/2016/04/so-what-is-a-pure-programming-language-anyway/)
*   [Managing One of the World's Largest Clojure Code Bases](https://www.youtube.com/watch?v=iUC7noGU1mQ)
*   [Curing Our Slack Addiction](https://blog.agilebits.com/2016/04/19/curing-our-slack-addiction/)
*   [Hard code golf: Regex for divisibility by 7](https://codegolf.stackexchange.com/questions/3503/hard-code-golf-regex-for-divisibility-by-7)
*   [Should Apple Build Their Own Cloud?](http://highscalability.com/blog/2016/3/30/should-apple-build-their-own-cloud.html)
*   [What Does Etsy's Architecture Look Like Today?](http://highscalability.com/blog/2016/3/23/what-does-etsys-architecture-look-like-today.html)
*   [Studying the Language and Structure in Non-Programmers’ Solutions to Programming Problems](http://alumni.cs.ucr.edu/~ratana/PaneRatanamahatanaMyers00.pdf)
*   [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)
*   [Functional Programming Design Patterns](https://fsharpforfunandprofit.com/fppatterns/)
*   [Types + Properties = Software](https://channel9.msdn.com/Events/FSharp-Events/fsharpConf-2016/Types-Properties-Software)
*   [10 things to avoid in docker containers](https://developerblog.redhat.com/2016/02/24/10-things-to-avoid-in-docker-containers/)
*   [Say 'No' to Home Technical Tests](https://blog.gladwell.me/warning-home-technical-tests.html)
*   [What are Bloom filters, and why are they useful?](https://sc5.io/posts/what-are-bloom-filters-and-why-are-they-useful/)
*   [GitHub lock-in?](http://agateau.com/2016/github-lock-in/)
*   [A Technical Perspective on the Apple iPhone Case](https://www.eff.org/deeplinks/2016/02/technical-perspective-apple-iphone-case)
*   [Graphing when your Facebook friends are awake](https://defaultnamehere.tumblr.com/post/139351766005/graphing-when-your-facebook-friends-are-awake)
*   [Stack Overflow: The Architecture - 2016 Edition](http://nickcraver.com/blog/2016/02/17/stack-overflow-the-architecture-2016-edition/)
*   [A Brief Tour of Nokogiri Decorators](https://blog.jbr.me/a-brief-tour-of-nokogiri-decorators/)
*   [Kill Your Dependencies](http://www.mikeperham.com/2016/02/09/kill-your-dependencies/)
*   [To gem, or not to gem](https://robots.thoughtbot.com/to-gem-or-not-to-gem)
*   [We Should All Have Something To Hide](http://www.thoughtcrime.org/blog/we-should-all-have-something-to-hide/)
*   [Functional Programming Is Not Popular Because It Is Weird](http://probablydance.com/2016/02/27/functional-programming-is-not-popular-because-it-is-weird/)
*   [Another Technical Debt Analogy](https://milanov.github.io/2015/05/05/another-technical-debt-analogy.html)
*   [A love letter to jQuery](http://madebymike.com.au/writing/love-letter-to-jquery/)
*   [Testing Rails applications in the life of a freelancer](http://www.rubyfleebie.com/testing-rails-applications-in-the-life-of-a-freelancer/)
*   [Tests vs Types](http://kevinmahoney.co.uk/articles/tests-vs-types/)
*   [I’m a web developer and I’ve been stuck with the simplest app for the last 10 days](https://medium.com/@pistacchio/i-m-a-web-developer-and-i-ve-been-stuck-with-the-simplest-app-for-the-last-10-days-fb5c50917df)
*   [Why I Quit my Dream Job at Ubisoft](http://gingearstudio.com/why-i-quit-my-dream-job-at-ubisoft)
*   [Simplifying Docker on OS X](https://blog.andyet.com/2016/01/25/easy-docker-on-osx/)
*   [Building side projects](http://cheeaun.com/blog/2016/01/building-side-projects/)
*   [Positive Lexicography: By Language](http://www.drtimlomas.com/#!language-lexicography/ud582)
*   [Should scientific papers be anonymous?](http://www.statnews.com/2015/12/30/should-scientific-papers-be-anonymous/)
*   [Game Genre Map: The Cognitive Threshold in Strategy Games](http://quanticfoundry.com/2016/01/20/game-genre-map-the-cognitive-threshold-in-strategy-games/)
*   [Bird IQ Tests: 8 Ways Researchers Test Bird Intelligence](https://www.audubon.org/news/bird-iq-tests-8-ways-researchers-test-bird-intelligence)
*   [Parents are Dumb and Kids Don’t Know Anything About Computers Anymore](https://medium.com/@seibelj/parents-are-dumb-and-kids-don-t-know-anything-about-computers-anymore-b59e974d052c)
*   [Lessons from the Core Engine Architecture of Bungie's Destiny](http://www.gdcvault.com/play/1022106/Lessons-from-the-Core-Engine)
*   [Ruby’s “each_with_object” vs. “tap + each”](http://rorbservations.com/post/136975265334/each-with-object-vs-tap-plus-each)
*   [Why GitHub is not your CV](https://blog.jcoglan.com/2013/11/15/why-github-is-not-your-cv/)
*   [Amazon has absolutely no idea how to run an app store](http://www.smashcompany.com/business/amazon-has-no-idea-how-to-run-an-app-store)
*   [Conceptual Debt is Worse than Technical Debt](https://medium.com/@nicolaerusan/conceptual-debt-is-worse-than-technical-debt-5b65a910fd46)
*   [Why I Have Nothing to Hide Is the Wrong Way to Think About Surveillance](http://www.wired.com/2013/06/why-i-have-nothing-to-hide-is-the-wrong-way-to-think-about-surveillance/)
*   [The Value of Downvoting, or, How Hacker News Gets It Wrong](https://blog.stackoverflow.com/2009/03/the-value-of-downvoting-or-how-hacker-news-gets-it-wrong/)

## 2015

*   [The Guardian goes all-in on AWS public cloud after OpenStack 'disaster’](http://www.computerworlduk.com/cloud-computing/guardian-goes-all-in-on-aws-public-cloud-after-openstack-disaster-3629790/)
*   [A Case Against Photorealism in Games](http://www.alanzucconi.com/2015/12/02/a-case-against-photorealism/)
*   [Impostor Syndrome: The One Challenge Developers Don't Talk About](http://product.hubspot.com/blog/engineering-challenge-impostor-syndrome)
*   [Why WhatsApp Only Needs 50 Engineers for Its 900M Users](http://www.wired.com/2015/09/whatsapp-serves-900-million-users-50-engineers/?mbid=social_twitter)
*   [Microservices won’t improve your code quality](http://www.marcotroisi.com/microservices-wont-improve-your-code-quality/)
*   [Interview Tests Considered Harmful](http://itturnsout.com/interview-tests-considered-harmful/)
*   [Our Responsibility as Software Developers](http://www.infoq.com/articles/Responsible-Software-Development)
*   [Building maintainable step-by-step tutorials with Git](http://info.meteor.com/blog/step-by-step-tutorials-with-git)
*   [GitHub: Scaling on Ruby, with a nomadic tech team](https://medium.com/s-c-a-l-e/github-scaling-on-ruby-with-a-nomadic-tech-team-4db562b96dcd)
*   [How learning data structures and algorithms make you a better developer](https://www.happybearsoftware.com/how-learning-data-structures-and-algorithms-makes-you-a-better-developer)
*   [Problems with Computer Science Education](https://www.fusionbox.com/blog/detail/problems-with-computer-science-education/567/)
*   [I Spent Spring Break Teaching Girls to Code](https://medium.com/bright/i-spent-spring-break-teaching-girls-to-code-ef14cf2ddf84)
*   [What we talk about when we talk about distributed systems](https://videlalvaro.github.io/2015/12/learning-about-distributed-systems.html)
*   [How To Become A Tech Conference Speaker](http://www.exceptionnotfound.net/how-to-become-a-tech-conference-speaker/)
*   [Your first year as a programmer](https://www.happybearsoftware.com/how-to-survive-your-first-year-as-a-programmer)
*   [Sources of Power](http://pathsensitive.blogspot.co.uk/2015/08/sources-of-power.html)
*   [Why I don’t answer most phone calls](https://medium.com/life-tips/why-i-don-t-answer-most-phone-calls-4a71e1418854)
*   [On The Security of Password Manager Database Formats](https://www.cs.ox.ac.uk/files/6487/pwvault.pdf)
*   [OO languages spend most effort addressing a minority use case](http://250bpm.com/blog:59)
*   [Why it’s so hard to innovate in the e-mail space](https://medium.com/@collinmathilde/why-its-so-hard-to-innovate-in-the-e-mail-space-9874e08e3426)
*   [Why Agile Makes Sense](https://martincolebourne.wordpress.com/2014/05/09/why-agile-makes-sense-software-development-compared-to-other-industries/)
*   [Everything Changes But You](http://benhowdle.im/everything-changes-but-you.html)
*   [Some things you should know about Steam](https://medium.com/steam-spy/some-things-you-should-know-about-steam-5eaffcf33218)
*   [Regular Expression Search With Suffix Arrays](https://blog.nelhage.com/2015/02/regular-expression-search-with-suffix-arrays/)
*   [Unix as IDE](http://blog.sanctum.geek.nz/series/unix-as-ide/)
*   [Contempt Culture](http://blog.aurynn.com/86/contempt-culture)
*   [A better way to teach technical skills to a group](http://miriamposner.com/blog/a-better-way-to-teach-technical-skills-to-a-group/)
*   [Decentralization for the web](https://lwn.net/Articles/652580/)
*   [Toyota Unintended Acceleration and the Big Bowl of Spaghetti Code (2013)](http://www.safetyresearch.net/blog/articles/toyota-unintended-acceleration-and-big-bowl-%E2%80%9Cspaghetti%E2%80%9D-code)
*   [The Fundamental Challenge of Computer System Performance](http://carymillsap.blogspot.com/2015/09/the-fundamental-challenge-of-computer.html)
*   [Top Games APIs](http://www.programmableweb.com/news/top-10-games-apis-eve-online-riot-games-battle.net/analysis/2015/11/25)
*   [Why we need to create careers for research software engineers](http://www.scientific-computing.com/news/news_story.php?news_id=2737)
*   [Software has diseconomies of scale](http://allankelly.blogspot.co.uk/2015/10/software-has-diseconomies-of-scale-not.html)
*   [Real-world benchmarking of cloud storage providers](http://lg.io/2015/10/25/real-world-benchmarking-of-s3-azure-google-cloud-storage.html)
*   [OS X El Capitan License: in Plain English](http://robb.weblaws.org/2015/10/17/os-x-el-capitan-license-in-plain-english/)
*   [What is the fastest algorithm to find the largest number in an unsorted array?](https://www.quora.com/What-is-the-fastest-algorithm-to-find-the-largest-number-in-an-unsorted-array/answer/Thomas-A-Limoncelli)
*   [Fandango Movie Ratings](http://fivethirtyeight.com/features/fandango-movies-ratings/)
*   [The Case for Getting Rid of Borders](http://www.theatlantic.com/business/archive/2015/10/get-rid-borders-completely/409501)
*   [Why video games have launch problems](https://playfab.com/blog/why-video-games-have-launch-problems/)
*   [How 'DevOps' is Killing the Developer](https://jeffknupp.com/blog/2014/04/15/how-devops-is-killing-the-developer/)
*   [Need Robust Software? Make It Fragile](http://www.yegor256.com/2015/08/25/fail-fast.html)
*   [Yes I Saw Your Text, But Don’t Expect Me to Respond Instantly](https://blog.automateads.com/yes-i-saw-your-text-but-dont-expect-me-to-respond-instantly/)
*   [Stop Asking Me Math Puzzles to Figure Out If I Can Code](https://countaleph.wordpress.com/2013/10/20/dear-startups-stop-asking-me-math-puzzles-to-figure-out-if-i-can-code/?HN2)
*   [Dotfiles are your Digital Backpack](http://www.madewithtea.com/dotfiles-are-your-digital-backpack.html)
*   [The help and harm of the $173 billion “voluntourism” industry](http://wilsonquarterly.com/stories/the-help-and-harm-of-the-173-billion-voluntourism-industry/)
*   [Secondary skills for software engineers](http://radek.io/2015/07/27/secondary-skills-for-software-engineers/)
*   [How does Shazam work?](http://coding-geek.com/how-shazam-works/)
*   [Who actually reads the code?](https://www.fsf.org/blogs/community/who-actually-reads-the-code)
*   [Why I'm The Best Programmer In The World](http://blog.codinghorror.com/why-im-the-best-programmer-in-the-world/)
*   [Becoming a contractor programmer in the UK](https://github.com/tadast/switching-to-contracting-uk/blob/formationsfactory/README.md)
*   [Why Side Projects Die](https://codelympics.io/blog/why-do-side-projects-die)
*   [The decline of Stack Overflow](https://medium.com/@johnslegers/the-decline-of-stack-overflow-7cb69faa575d)
*   [Should you write your back-end as an API?](http://programmers.stackexchange.com/questions/287819/should-you-write-your-back-end-as-an-api)
*   [Too long? Read anyway.](http://blog.lmorchard.com/2013/02/25/too-long-read-anyway/)
*   [Do we need browsers?](http://blog.justletit.be/posts/do_we_need_browsers/)
*   [Why You Should Teach Programming](http://scionsoftware.com/Blog/why-you-should-teach-programming/)
*   [Blog Little Things](http://coffeecoder.net/blog/blog-little-things/)
*   [Thinking with the machine](http://www.drmaciver.com/2015/06/thinking-with-the-machine/)
*   [Why I wont do your coding test](http://www.developingandstuff.com/2015/05/why-i-dont-do-coding-tests.html)
*   [Spurious Correlations](http://tylervigen.com/spurious-correlations)
*   [What it’s really like to work for a tech giant](https://medium.com/swlh/what-it-s-really-like-to-work-for-a-tech-giant-4462fd18ce19)
*   [Discovering Two Screens Aren’t Better Than One](http://www.nytimes.com/2014/03/20/technology/personaltech/surviving-and-thriving-in-a-one-monitor-world.html)
*   [The perils of programmer education in the bazaar](http://practicingdeveloper.com/2015/06/04/the-perils-of-programmer-education-in-the-bazaar/)
*   [Why You Should Consider Freelancing](http://blog.webflow.com/why-you-should-consider-freelancing)
