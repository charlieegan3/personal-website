---
aliases:
- /blog/2017/03/26/vim
title: Fixing up my vimrc
date: 2017-03-26 00:48:53 +0000
---

After working closely with a proficient vim user on a summer internship; I
started experimenting with vim during the summer of 2015. I made the usual
mistakes of copying the other's vimrcs and installing too many plugins - I
think everyone has to go though that phase though. Eventually I settled; after
much tinkering; on a configuration I could be productive in and left it largely
unchanged for a year.

In the same way it's easy to procrastinate while refining the 'perfect' vim
config, it's also possible to let it stagnate and stop learning. With vim,
there's usually something you could improve upon.

Recently, I've been looking to minimize the areas of my development environment
that require manual setup. I've also been looking to reduce the difference
between my Linux and macOS machines. While my vim journey started earlier,
it's been key in making this possible.

I recently revisited my vim config and made some improvements.

# Neovim & terminal buffers
I've been using i3 and urxvt on my Linux machine. On macOS I use iTerm.
This means the process for opening new editors windows and terminal sessions
differs - something i'm keen to avoid. I considered working at the various
keyboard shortcuts to make the two comparable but in remembering that neovim
adds terminal buffers I thought I'd give that a shot. I'd already got vim
working consistently cross platform - using neovim makes terminal session
usage consistent too.

I was able to port my vim config to nvim very easily. I had an addon that
wouldn't work and added the following commands.

```vim
if has('nvim')
  tnoremap <esc> <C-\><C-n>

  augroup terminal
    autocmd TermOpen * set bufhidden=hide
    autocmd TermOpen * setlocal nospell
  augroup END
endif
```

I also added a script to link the nvim configs to the old vim ones. I might
just move them all to nvim at a later date.

```bash
#!/bin/bash

ln -s ~/.vim ~/.config/nvim
ln -s ~/.vimrc ~/.config/nvim/init.vim
```

# The `"+` buffer
I struggled along with a thoroughly inadequate and irregular system for
pasting in and cutting out of vim for too long. I knew about the `"+`
register but didn't make use of it.

```vim
vnoremap <cr> "+y<cr>
vnoremap <BS> "+p<cr>
```

The best this about this is that it makes it possible to copy to and from the
clipboard on both Linux and macOS (in the same way).

# buftabline
I lived with a similarly awkward setup for managing open buffers. I have
`<tab>` mapped to `:bn` in normal mode - as well as `leader w` to write
and close the buffer. However I didn't have a means of tracking open files; I
just used to cycle round until I got the one I wanted - or I'd just use
FZF (ctrl-p) again. `buftabline` simply shows a list of open buffers at the
top edge of the window - like almost any other editor... Getting caught up.

```vim
Plug 'ap/vim-buftabline'

highlight BufTabLineCurrent ctermbg=black
highlight BufTabLineActive ctermbg=white
highlight BufTabLineHidden ctermbg=darkgrey
highlight BufTabLineFill ctermbg=grey
```

# base16 colorscheme
I'm fairly indifferent about color schemes - though I like them to be the
same across my different computers. I came across
[the base16 standard](https://github.com/chriskempson/base16)
and decided to use that as I was able to find `.Xresources`, `.terminal` and
vim files for without needing to set my own values. I found a preset called
London Tube (which seemed fitting) and have just committed that into my
dotfile repo.

# autocmds for formatting
Whitespace trimming and tabs -> spaces had also been inconsistent in the old
config. I had been using `vim-stripper` for trimming trailing whitespace but
it turns out a simple regex does the job:

```vim
autocmd BufWritePre * :%s/\s\+$//e
```

I also opted to use a plugin, `vim-super-retab`, to correct the tabs before
save. This is in addition to a number of other settings available by default.

```vim
autocmd BufWritePre * :Tab2Space

set smarttab smartindent expandtab " sane tab settings
set tabstop=8 softtabstop=8 shiftwidth=2 " indentation quantities
set backspace=indent,eol,start " backspace behavior
```

---

Those are just the vim ones; I've also changed i3 around and dropped some
things on macOS in the year long task of adopting a developer environment that's
highly portable.