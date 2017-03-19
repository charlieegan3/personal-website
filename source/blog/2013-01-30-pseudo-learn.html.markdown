---
layout: post
title: pseudo-learn
date: '2013-01-30T00:30:00+00:00'
tags:
- computer science
- programming
- algorithm.
- maths
- pseudocode
---
I recently sat an exam for a course called ‘Programming and Principles’ ([CS1022](http://homepages.abdn.ac.uk/w.w.vasconcelos/pages/teaching/CS1022/)), it’s a compulsory, first year, computer science course. However only 12.5% of the grade is programming, the rest? Principles.

Principles turned out to be something else: Maths. Maths that was twisted to link vaguely to very abstract computing problems. One key part of this was learning algorithms in pseudocode. Just simple things like methods to calculate factorials and so on - I found this part of the course quite easy but really didn’t like it for two reasons.

Firstly, the technique seems to have the wrong priorities, condensed over clarity. While the code may look mathematically stunning it makes it many times harder to read quickly. Why call count** **just i?** **Surely that’s not helping anyone? If you’ve got many nested loops you might want to call the counter variables i,j,k but when you’ve only got two loops what’s so wrong with** **inner** **and outer?** **I think it’s a kind of math snob thing - lets write this in a way that we all understand but so that  on one else has a hope - the more we detach it from the real world the better.

On the topic of 'real world’ this brings me to my next point. I understand that I’m largely unqualified to preach about the real world of programming but common sense applies here. In the real world people use modern programming languages to get stuff done. These languages are designed to be the _fastest and most efficient_ way to implement specific types of applications. This means that you only _never_ need to write a sorting algorithm or factorial calculator - they are all done for you. This is really important to help keep code readable too, how much easier on the eye is array.sort()** **than a whole sorting algorithm?

You might say: these is the fundamentals and you need to know how to use them. I say: it’s not as if we’re going to run out of stuff to learn there are other important topics too, it’s just about priorities. Another response might be: these are cross-language skills. In response: so are design paradigms they get much less coverage, certainly in 1st year.

This Is just how I see it, I believe you can teach everything essential through real practise. This kind of skill should be taught be as part of a specialised algorithms course rather than part of an introduction to computing science as a whole.
