---
title: |
  About 7 days of Racket
date: 2021-03-06 00:00:00 +0000
---

![screenshot-2021-03-06_12-36-44.png](screenshot-2021-03-06_12-36-44.png)

I decided to spend a few hours over the course of about 2 weeks playing with [Racket](https://racket-lang.org/). I suppose these were my reasons for doing this:

- I've been interested in [Datalog](https://en.wikipedia.org/wiki/Datalog) since I learned it was [inspiration](https://www.openpolicyagent.org/docs/latest/policy-language/#what-is-rego) for OPA's Rego (it's possible to run Datalog as [a Racket language](https://docs.racket-lang.org/datalog/Tutorial.html)).
- I never got the chance to use a Lisp/Scheme at university.
- I wanted to do something different from work, and my previous side projects had all also been in Go - and I wasn't really enjoying one of them any more.

Throughout the process I took some notes about things I noticed and how I felt about them at that point in my little (bracket (heavy adventure)).

## Day 1

- I started with trying to work out how to parse command line options. I think this was too soon and having never written any Racket before I found the [docs](https://docs.racket-lang.org/reference/Command-Line_Parsing.html#%28form._%28%28lib._racket%2Fcmdline..rkt%29._command-line%29%29) for  `command-line` a little overwhelming.
- `go fmt` has made me lazy - and, at this point - I felt I was missing this in Racket. I soon changed my mind on this (Day 4).
- I completed the images example in DrRacket which was quite fun.
## Day 2
- I decided to work on the most simple project I could think of, the [script](https://github.com/charlieegan3/charlieegan3) which updates my GitHub profile README. This downloads some data, formats it as markdown, and commits the file in GitHub Actions (note, the data is generated in [another project](https://github.com/charlieegan3/json-charlieegan3)).
- Keen to keep things simple, I started with a [helper function](https://github.com/charlieegan3/charlieegan3/blob/6effe8a1614337467b48679da2f2f441bf0ee195/updater/markdown/link.rkt) to generate markdown links. I knew that I needed this and it was something which was easy to work on in isolation from the world outside of Racket.
- At this point I didn't know that it was possible to run tests with `raco test` and so was using `racket file.rkt`. This was fine while my files only contained function definitions and tests.
- RackUnit seemed very simple and I quite enjoyed using it for 'test-driven-developmenting' these functions. I did find it took me some time to get my eye in for the various exceptions or messages when cases failed. The information I needed was there, but it wasn't immediately obvious to me as a newbie.
- I learned that there were two syntaxes available for [regexp](https://docs.racket-lang.org/guide/regexp.html#%28tech._regexp%29), `#rx` and `#px`.
- I had a goal of making nice error messages for invalid input to my helper functions. I eventually worked out how to concat and return multiple errors, but this felt rather DIY. As a train fan, I really appreciate the [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/) idea, and found this wasn't standard in Racket land.
    ```scheme
    (define (validate text url)
      (let ([errors (string-append (validate-text-safe text) (validate-url-has-protocol url))])
        (if (not (equal? errors ""))
          (error errors) (list))))
    ```
## Day 3
- I worked out how to run my tests with `raco test` as I added new files with more tests. I felt for a very simple and entirely local test suite that this was quite slow. I don't know why this is.

![ezgif.com-video-to-gif.gif](ezgif.com-video-to-gif.gif)

- I quite enjoyed that there were a lot of helper functions already in the standard library, e.g. finding `nor` in `(require racket/bool)` was fun.
- I also *really* like being able to write tests in the same place as the implementation with `(module+ test ...`
    ```scheme
    (module+ test
      (require rackunit)
      (test-case
        "generates a link given text and url"
        (let ([text "text"] [url "https://example.com"])
        (check-equal? (md-link text url) "[text](https://example.com)")))
    ```
    I'm not sure if this is 'good Racket' as it means that I don't have an easy way to only run the files with tests in. As you can see in the animation above, I'm excluding the main.rkt file.
- I started to find terseness & minimal syntax pleasing.
## Day 4
- I decided not to work out the difference between `eqv?` and `eq?` when I just wanted to store some data in a hash.
- I wrote a function using `foldr` for the first time which was not a university exercise. To an imperative brain like mine, this felt like a refreshingly declarative way of determining the missing keys in a hash:
    ```scheme
    (define (hash-missing-keys required-keys hash)
      (foldr
        append
        '()
        (map
          (lambda (e) (if (not (hash-has-key? hash e)) (list e) '()))
          required-keys)))
    ```
- Still drinking the functional kool-aid and missing Ruby's [dig](https://ruby-doc.org/core-2.3.0_preview1/Hash.html#method-i-dig) method I made my own recursive version:
    ```scheme
    (define (hash-dig path hash)
      (case (length path)
        [(1) (hash-ref hash (first path))]
        [else (hash-dig (rest path) (hash-ref hash (first path)))]))
    ```
- After missing `go fmt` on Day 1, I found that it was actually quite natural to break down long lines into something more readable.
- I wondered what a *[thunk](https://docs.racket-lang.org/reference/procedures.html#%28form._%28%28lib._racket%2Ffunction..rkt%29._thunk%29%29)* was, but decided not to work it out just yet.
## Day 5
- I got caught out by this subtle difference:
    ```scheme
    > (equal? '(1 '(1 2) 3) (list 1 (list 1 2) 3))
    #f
    > (equal? '(1) (list 1))
    #t
    > (list 1 (list 1 2) 3)
    '(1 (1 2) 3)
    > '(1 '(1 2) 3)
    '(1 '(1 2) 3)
    ```
- I wrote a pretty involved function to validate that hashes have a given schema of nested keys. I think that this is one I won't understand in a few months and would likely have been better broken down more. I found that this larger function was also harder to debug as I built it up and that I was still getting my eye in for the different error messages.
    ```scheme
    (define (hash-schema hsh schema [prefix ""])
      (let
        ([missing-keys (foldr
                         append
                         '()
                         (map
                           (lambda (e)
                             (if (list? e)
                               (hash-schema (hash-dig (list (first e)) hsh) (rest e) (format "~a" (first e)))
                               (if (hash-has-key? hsh e) '() (list e))))
                           schema))])
        (if (equal? prefix "")
          (if (> (length missing-keys) 0)
             (format "missing: ~a" (string-join missing-keys ", "))
             "")
          (if (> (length missing-keys) 0)
             (map (lambda (e) (format "~a.~a" prefix e)) missing-keys)
             '()))
    ))
    ```
- I learned how to [declare optional arguments](https://docs.racket-lang.org/guide/lambda.html#%28part._.Declaring_.Optional_.Arguments%29)
## Day 6
- I [refactored](https://github.com/charlieegan3/charlieegan3/commit/36121039dfe00aac725e2bf74189e6be4eeb0f30) my validation functions into a single function. This took me a while as it was quite a lot of text editing, however I feel like it's less daunting to take on this kind of operation than it is in some other languages I've used. Much of that might just be the lack of typed data...
- I found the [heredoc syntax](https://github.com/charlieegan3/charlieegan3/blob/6effe8a1614337467b48679da2f2f441bf0ee195/updater/render.rkt#L82-L85) a little unpleasant - as it is in almost all languages...
## Day 7
- Being keen to wrap this up, I opted to cut the scope and fetch the data using curl (and commit the updated README file using my existing Ruby script).
- I ended up using [Gregor](https://docs.racket-lang.org/gregor/index.html) to parse and compare my datetime data. It was a shame that this wasn't in the standard library as it's my only dependency.
- '() caught me out again here ([I *think...*](https://stackoverflow.com/questions/66505664/can-range-x-y-be-used-in-a-racket-dispatch-case))
    ```scheme
    > (case 2
        [(1 2 3) "matched"]
        [else "no match"])
    "matched"
    > (case 2
        [(range 1 4) "matched"]
        [else "no match"])
    "no match"
    ```
- I got it running and updating my page in GitHub Actions! 🎉
## So where does that leave me?

I think the exercise served its purpose in getting myself familiar with the syntax and getting to a point where I'm more confident to try other things in the Racket world such as extending the [Datalog implementation](https://docs.racket-lang.org/datalog/).

That said, I'm going to take a bit break and do some other similarly 'spiky' experiments for my next projects to see where they take me.

I did enjoy much of the Racket experience but wasn't really satisfied with how my error handling/validation code works, or how I'm expected to manage dependencies.
