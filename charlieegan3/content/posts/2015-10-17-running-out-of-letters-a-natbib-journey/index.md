---
aliases:
- /blog/2015/10/17/running-out-of-letters-a-natbib-journey
title: Running out of letters - A natbib journey
date: 2015-10-17 18:26:00 +0000
tags: latex
---
I wrote a risk assessment of the Heroku platform in Latex this term. It was my first large report using Latex, I ran into the following error and it look me a long time to figure out.

```latex
Runaway argument?
Author(Year{\natexlab {{}})]{natbib_key} Author. \newblock Author u\ETC.
! Paragraph ended before \@lbibitem was complete.
<to be read again>
          \par
          l.257
```

What this means is that the you cited more than 26 time for the same Author in the same year (*Heroku, 2015*). The problem was this: `\bibliographystyle{plainnat}`. This style, quite reasonably, sets the letter limit. Too bad the error message is just so awful.

The key step was opening up `.bbl` file and see to see `\natexlab {{}})natexlab` where the `{{}}` were missing a letter - vs the earlier citations.

##TL;DR

```git
-  \bibliographystyle{plainnat}
+  \bibliographystyle{abbrv}
```

`abbrv` is likely the correct format anyway for scientific publications and is likely already in your class file (but I didn't have one of these).