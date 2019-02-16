---
aliases:
- /blog/2013/02/26/remove-dupes-from-the-open-with-menu
layout: post
title: Remove Dupes from the 'Open With' Menu
date: 2013-02-26 00:30:00 +0000
---
A problem that I’ve had since upgrading to 10.8 Mountain Lion has been with the
Open With menu. I find that over time there is a build up of duplicates.
Primary offenders seem to be: Pixelmator and Evernote. This seems to solve the
problem:

    /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r -domain local -domain user
    killall Finder
    echo "Open With has been rebuilt, Finder will relaunch"

Then Relaunching the Finder with <code>⎇+cmd+esc</code> should solve the
problem. However I found that the issue kept coming back. I just decided to
remove all the apps and assign apps manually. You can do the same by following
this guide [here](http://osxdaily.com/2011/02/03/clear-open-with-menu-mac/).