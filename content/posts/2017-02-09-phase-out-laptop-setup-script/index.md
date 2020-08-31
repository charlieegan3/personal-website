---
aliases:
- /blog/2017/02/09/phase-out-laptop-setup-script
title: "Phasing out my laptop setup script"
date: 2017-02-09 18:13:53 +0000
---

**TL;DR** - I switched from a complicated script that personalised my development laptop to a setup minimal enough to make it irrelevant.

I've used an Mac as my main computer since 2005, in 2005 I was 11 years old. Recently, a number of factors have pushed me to consider alternatives, the reasons for which are beyond the scope of this post. The consequence is that I've been looking to port my development environment to a Linux workstation.

I have a dotfiles repository on GitHub. This contains a number of config files for programs that I use use such as bash and vim. It also includes bootstrap script for setting up a developer laptop on MacOS and I've used this laptop bootstrap script to save me multiple hours on more than one occasion. However - recently, I've come to see it as something of a burden that's a pain to maintain and makes me less adaptable.

My bootstrap script installs Homebrew packages, casks and configured the OS just the way I liked it. This won't work on Linux. I've also decided that I no longer want to automate this task but rather alter the way I work to make it irrelevant. To get to this point I've had to make some key changes:

* Using a command line text editor (2015)
* Using docker and compose
* Replacing tools that require a native app, e.g. Day One
* Implementing some self hosted tools
* Using a web based password manager
* Hosting my own bookmarks
* Using a cross platform browser like Firefox (2017)

If that list doesn't make it clear, I'll state it upfront: **this isn't a guide to setting up your development environment but rather a justification for a change I'm making to mine**. So why ditch the bootstrap script? I don't think I need one. I've spent some free time arriving at the following setup, again - this is largely enabled by the changes implemented in the list above.

1. Install the Manjaro i3 distro. i3's config files and keybindings really resonated with me, this was the first distro I found that bundled i3. Sure it's easy to install i3 over an Ubuntu system but I like pacman & this new setup is all about making use of sensible defaults already available.
2. Install Firefox and sync settings (side note, FF extensions don't sync settings well - reduce dependencies on them where possible, also).
3. Import my GPG and ssh keys.
4. Clone my config files repo into my home directory.
5. Install docker.

Looking at that list, would you bother to write a script for that? I've decided I don't need to.