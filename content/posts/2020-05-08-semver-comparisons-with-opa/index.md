---
title: SemVer comparisons with OPA
date: 2020-05-08 11:29:00 +0000
---

**Update:** I've written a follow up post [here](/posts/2020-08-31-rego-semver-contribution/) explaining how I later added this functionality to Rego itself.

![versions.png](versions.png)

I recently found myself faced with the task of writing [OPA](https://www.openpolicyagent.org/) policies that involved comparing [Semantic Versions](https://semver.org/). It seemed like an interesting challenge, and something more useful than [validating Christmas trees](https://www.notion.so/posts/2019-12-05-rego-fun/)...

This was the end goal, a function that was able to compare two versions:

```go
is_greater_or_equal("1.0.0", "0.1.0")
// => true
is_greater_or_equal("1.0.0", "2.0.0")
// => false
is_greater_or_equal("1.0.0", "1")
// => true
```

While some of the functions are refined from their original implementations, the
process went something like this.

## How can we parse versions and represent them?

First, I decided on an internal representation for a Semantic Version, I settled
on the following object - for better or worse.

```go
{
  "major": int,
  "minor": int,
  "patch": int,
}
```

Next, I needed a means of parsing the version strings and getting back versions
in my representation. So I needed the following to work:

```go
parse_version_string("1.0.0")
// => { "major": 1, "minor": 0, "patch": 0 }
parse_version_string("2.3.4")
// => { "major": 2, "minor": 3, "patch": 4 }

// but also...
parse_version_string("1.0")
// => { "major": 1, "minor": 0, "patch": 0 }
parse_version_string("1")
// => { "major": 1, "minor": 0, "patch": 0 }

// and also...
parse_version_string("v1.0.0")
// => { "major": 1, "minor": 0, "patch": 0 }
```

To implement `parse_version_string`, it seemed to make sense to start by
splitting on '.' - then all I needed was a means of creating a new version from
the split data.

```go
parse_version_string(version_string) = version {
	components := split(version_string, ".")
	version := new_version_from_components(components, count(components))
}
```

Using multiple function heads (or whatever these are called in Rego) seemed like
an ok way to handle the different lengths. I called *major*, *minor* and *patch*
‘components’ *sigh*, nice and generic...

```go
new_version_from_components(components, 1) = version {
	version := new_version(components[0], 0, 0)
}
new_version_from_components(components, 2) = version {
	version := new_version(components[0], components[1], 0)
}
new_version_from_components(components, 3) = version {
	version := new_version(components[0], components[1], components[2])
}
new_version(major, minor, patch) = version {
	version := {
			"major": to_number(trim_prefix(sprintf("%v", [major]), "v")),
			"minor": to_number(minor),
			"patch": to_number(patch)
		}
}
```

Note that I also wanted `new_version` to work with strings or numbers (this made my tests easier to write and handling the 'v' prefix possible).

So now I have a means of creating versions in my internal representation.

## What does 'greater' mean and how do we define it?

What does ‘greater’ mean in SemVer? I didn’t read the spec, so this might be
missing something, but my definition was any of the following:

- major version is greater
- major is equal, and minor version is greater
- major is equal, minor is equal, patch is greater

Now I needed to find a means of writing this in Rego. Fundamentally, I need to
make comparisons between the parts of the version. I created two functions like
this which operate on two versions:

```go
is_key_greater(key, a, b) = result {
	result := a[key] > b[key]
}
is_key_equal(key, a, b) = result {
	result := a[key] == b[key]
}
```

These will return the integer comparison of the components at the given ‘key’
(major, minor, or patch).

With these building blocks I can implement my definition for ‘is greater’:

```go
is_greater(a, b) = result {
	result := {
		{ is_key_greater("major", a, b) },
		{ is_key_equal("major", a, b), is_key_greater("minor", a, b) },
		{ is_key_equal("major", a, b), is_key_equal("minor", a, b), is_key_greater("patch", a, b) },
	} & { { true } } == { { true } }
}
```

This reads as: “bind the result to true if the set of conditions contains one
that is true; where a condition is true if all the sub conditions are also
true”. Sub conditions in this case being the comparisons between the version
components.

In order to achieve world domination with `is_greater_or_equal` we also need to
have a definition for version equality - this one is more straight forward:

```go
is_equal(a, b) = result {
	keys := ["major", "minor", "patch"]
	result := { r | key := keys[_]; r := is_key_equal(key, a, b) } == { true }
}
```

I read this as, “for all version components (with keys master, minor, patch),
check the components in both versions are strictly equal”.

With these two, the implementation of `is_greater_or_equal` is trivial:

```go
is_greater_or_equal(a, b) = result {
	result := {
		is_greater(a, b),
		is_equal(a, b),
	} & { true } == { true }
}
```

I read this as: “any element in the set { is_greater(a, b), is_equal(a, b) } is
true”. We test this using set intersection with `{ true }`.

## This is a mess, you should go back to school!

I’ve been writing Rego policies for a while now, I find them fun - a little like a puzzle or something. However, I have no background in logic programming and sometimes wonder if there is a better way to do things. I still regularly find myself mapping from imperative thinking to my declarative policies.

You can review all the code in [this gist](https://gist.github.com/charlieegan3/76dbec05c65164ac98dfec74b1381c5a). Feel free to comment there if you have questions or suggestions. I’m also on [Twitter](https://twitter.com/charlieegan3).
