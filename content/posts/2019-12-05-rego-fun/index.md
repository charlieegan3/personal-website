---
title: "Fun things I did in Rego while validating Christmas Trees"
date: 2019-12-05 21:53:39 +0100
---

I've been working on fun project recently for the 'Christmas Show & Tell' event
at the London Computation Club. At club show and tells there are imaginary
points available for matching the theme. I like imaginary points and decided to
make a system that would validate drawings of Christmas trees using
[OPA](https://www.openpolicyagent.org/) &
[Rego](https://www.openpolicyagent.org/docs/latest/policy-language/).

If you're interested in playing with the tool I demoed, you can find it
[here](https://xmas-trees.charlieegan3.com/). This post is more about the Rego I
found myself writing as part of the project.

## OPA 'handlers' & gathering it all up

Quite some time ago I
[learned](https://github.com/open-policy-agent/opa/issues/1818) about the
(apparently little known) `v0` [Data
API](https://www.openpolicyagent.org/docs/latest/rest-api/#get-a-document-webhook)
on the OPA server. This makes it easy to map different requests to different
policies on the same OPA server instance. Even though I have only one policy to
validate my trees - I used this method to run my `main.rego` policy
[here](https://github.com/charlieegan3/policing-christmas-trees/blob/b90a6cfe064defebaec5aee89b48f11aed78a044/server/main.rego).

The most interesting part of this policy is how the messages from my various
`deny` policies are aggregated.

```go
output = {m | m := deny[_]}
```

There's a few things going on here.

- I see `deny[_]` as finding all solutions to `deny` (where `deny` is a policy
  that returns a message if the input is invalid) - basically gathering all the
  messages for the input.
- `{m | m := deny[_]}` is gathering up all these messages using a
  [comprehension](https://www.openpolicyagent.org/docs/latest/policy-language/#comprehensions).
  Crucially, these messages are aggregated into a Set not a list (e.g. `[m | m
  := deny[_]]`) - this is important because sometimes there are many identical
  reasons an input can be invalid for a given input.

I [asked](https://stackoverflow.com/questions/58895492/limit-opa-rego-to-a-single-rule-solution)
if it were possible to halt the execution once a solution had been found.
Thinking about the domain for which OPA was built, it's perhaps
unsurprising that it is not.

## A humble membership test

I'm not including
[this](https://github.com/charlieegan3/policing-christmas-trees/blob/dda4a8f92e9c09781782a11610769bc85ccfd596/server/topper.rego#L4-L11)
because I think it's especially wow but rather as an
example of something basic I'd never needed to do before in the policies I'd
written at work.

```go
allowed_toppers := {"angel", "star"}
allowed_toppers & {input} == set()
message :=
  sprintf("topper '%s' not in list: %s", [input, concat(",", allowed_toppers)])
```

This allows me to validate that the input is within some known good static set
of strings. We assert that if the intersection of the set of the input and the
known set is empty (`set()`) then we must bind to the error message.

In this particular it's quite easy to explain why the input is invalid in the
message too.

## Universal Quantifications

I ended up reaching for Universal Quantifications twice in this project -
something I'd not used before in Rego.

When validating [baubles](https://github.com/charlieegan3/policing-christmas-trees/blob/b90a6cfe064defebaec5aee89b48f11aed78a044/server/baubles.rego#L9-L12)
I found that I needed to validate that it was placed on a single point on the
tree outline. This lead me to create a simple test to ensure that there as
matching point.

You might be thinking that this sounds more like an _Existential
Quantification_. All my policies are written as `deny` - I'm not sure why but
this is how I'd always done it at work and it seemed to make sense to continue.

What it does mean is that to assert that there exists a point on the outline,
you need to describe the error case as being when the count of all matching
points is zero. It's kinda backwards.

```go
count({point |
	point := input.outline[_]
	point == bauble
}) == 0
```

I realise now this can be condensed some to the form below, but I think the
original is more readable.

```go
count({point |
	input.outline[point] == bauble
}) == 0
```


I needed to do a similar thing for [tinsels](https://github.com/charlieegan3/policing-christmas-trees/blob/b90a6cfe064defebaec5aee89b48f11aed78a044/server/tinsels.rego#L21).
Tinsel start and end points must be on a segment of the tree outline. Here the
checking logic is more involved so I've written it up in the next section. The
idea is the same though really where I'm using Universal Quantification to
validate a solution exists.

## why-eeq-wals-em-ex-plus-see

`y = mx + c` was also something I'd not needed to use when validating Kubernetes
YAMLs.

The reason tinsels were harder than baubles is that they can lie between two
points on the outline (but they _must_ be on the outline). The only way I knew
do this was with the [line
equation](https://github.com/charlieegan3/policing-christmas-trees/blob/b90a6cfe064defebaec5aee89b48f11aed78a044/server/tinsels.rego#L34-L42)
and [bounds
checking](https://github.com/charlieegan3/policing-christmas-trees/blob/b90a6cfe064defebaec5aee89b48f11aed78a044/server/tinsels.rego#L44-L52)
on the coordinate values
so that's what I did - in Rego ofc!

First I calculate the gradient and intercept for the outline segment:

```go
gradient := (outline_point_a[1] - outline_point_b[1]) /
			(outline_point_a[0] - outline_point_b[0])

y_intercept := -1*((-1*outline_point_a[1]) + (gradient * outline_point_a[0]))
```

Then I can plug the point for the tinsel into this and find out if we're good.

```go
expected_y := gradient * point[0] + y_intercept
expected_y == point[1]
```

<hr>

So there you have it. Some things I did in Rego in the name of festive fun.

In the new year I'm going to be spending my time working on Jetstack's
[_Preflight_](https://github.com/jetstack/preflight), an open source tool for
infrastructure policy checking built on Rego. Hopefully that will be fun too.
