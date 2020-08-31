---
aliases:
- /blog/2016/07/11/things-i-like-about-rust
title: Things I like about Rust
date: 2016-07-11 01:33:00 +0000
---

I've recently completed my first useful Rust application. standpoint is a demo of an information extraction approach implemented as part of my honours project. I have implemented a dependency graph query tool as part of this approach; the application's Rust component. This is short post about some things I've enjoyed about Rust so far.

## Cargo
Coming from Ruby, Bundler is a tough act to follow. I've never needed had to push the edges on Bundler or Cargo but Cargo absolutely feels of a comparable quality. As part of my project I implemented a crate for querying a generic graph. Cargo made this process really easy. This is more than connecting and publishing to crates.io, cargo is the whole picture - running tests & compiling too. Whether one should publish packages which are likely only for personal use is another matter, in this case it seemed to make sense for me.

## Error messages (with codes)
Rust errors seem to be universally described as easy to understand. While I think they're good, when coming from an interpreted language, there's still something of a learning curve. I found the error codes useful for doing a little extra reading when things didn't make sense (which happened quite often at the beginning).

## Modules make sense
Over the last 4 years I've been thrown in at the deep-end for various languages. Rust's system of modules and code imports from external packages stood out as one of the better ones - all helped along by Cargo. Certainly compared to Go (which I spent a similar amount of time with last Christmas), Rust and Cargo are far simpler than anything I could find at the time (glide seemed to be the best match).

## Enum Types
Rust has been my first real exposure to Enum types (I have only spent a very short while with Haskell). `Result` and `Option` are really satisfying to use and have helped me get better at reporting neat and meaningful errors (as opposed to rescuing a function call in Ruby). I have however found my code growing into a *Pillar of Doom*, while the `try!` macro can help, there are cases where I've found this harder to resolve (when not all functions return a `Result`).

***

I have also come across some areas that are a little rough around the edges. *Rustfmt* isn't at the same level as *Gofmt* and often seems to struggle with longer statements broken over multiple lines. I've also found that the compiler times can grow quite quickly. I fear this is as much my fault for perhaps not including code with in the best way.

In summary, I'm really liking Rust and I'm keen to keep using it for future side projects.