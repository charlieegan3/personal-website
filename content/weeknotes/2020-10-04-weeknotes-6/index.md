---
title: |
  Week 6
date: 2020-10-04 00:00:00 +0000
aliases:
- /posts/2020-10-04-week-notes-6/
- /week-notes/2020-10-04-week-notes-6/
---

- I've continued to 'build' my [linux-environment](https://github.com/charlieegan3/linux-environment) project this week and have added/achieved the following notable features:
    - Screen sharing using pipewire!
    In Firefox it wasn't working as I [hadn't set `XDG_CURRENT_DESKTOP`.](https://old.reddit.com/r/swaywm/comments/iqr0se/screen_sharing_works_sometimes_with_chromium/) In Chromium I [needed to enable `chrome://flags/#enable-webrtc-pipewire-capturer`.](https://fhackts.wordpress.com/2019/07/08/enabling-webrtc-desktop-sharing-under-wayland/)
        Zoom is still relying on a GNOME hack involving screenshots, but Zoom web seems to work ok via Chromium.
        ![screenshot-2020-10-03_22-23-14.png](screenshot-2020-10-03_22-23-14.png)
    - Configured a base16-backed synchronized day/night mode. I have a button that toggles the setting of the theme for nvim and Alacritty using their hot reload & remote control features.
        ![ezgif.com-video-to-gif.gif](ezgif.com-video-to-gif.gif)
    - As mentioned last week, I added a [long script](https://github.com/charlieegan3/linux-environment/commit/14857b47128cd385fbda04ae1604f29a6cced894) to sync secrets between machines and instances using the [Bitwarden CLI](https://github.com/bitwarden/cli). It's not that swish, but it does the job better than my current lack of a system.
    - I also start sway in the recommended way, using [systemd-cat](https://github.com/charlieegan3/linux-environment/commit/12b22664c7892cee55dda65f0dbf1780da30c747#diff-0aa34e847338db235914455015bc5573R8) so that I get all the logs in journalctl for the desktop environment. I also moved mako to run as a user service in systemd.
    - Connected my bluetooth headphones with almost no issue.
    I'm planning to use the new machine for work this week so that I can send off my laptop for repair - its keys are falling off.
- I went for my first Autumn swim at the Lido and had to get out in 20 minutes from the cold on my head. I have since purchased an insulated swim cap but the weather's been so dreadful I've not been keen to even leave the house, let alone swim outside...
- At work I've been frustrated with more frontend work but enjoyed helping setup a much needed company all hands event. I also got a new 4k monitor (U2720Q), pictured below.
    ![EA69333B-6A9E-48EB-8B85-3430718377FF.jpeg](EA69333B-6A9E-48EB-8B85-3430718377FF.jpeg)
