---
title: Deploying Go as a binary on Heroku
date: 2015-12-26 13:05 UTC
tags:
---
Here are the steps to deploy a "Hello World" Go app on Heroku as a binary - rather than the method outlined in their [tutorial](https://www.heroku.com/go#see-it-in-action) which uses GoDeps.

These instructions are based somewhat on those for the [heroku-binary-buildpack](https://github.com/ph3nx/heroku-binary-buildpack).

1. Create a Heroku app for the project:

        create APP_NAME --buildpack https://github.com/ph3nx/heroku-binary-buildpack.git
2. Setup the working directory by cloning from the Heroku remote:

        heroku git:clone --app APP_NAME
3. Create a simple Go app, `server.go`:

        package main

        import (
            "fmt"
            "net/http"
            "os"
        )

        func handler(w http.ResponseWriter, r *http.Request) {
            fmt.Fprintf(w, "Hello World. Path: %v", r.URL.Path[1:])
        }

        func main() {
            fmt.Printf("Port: %v\n", os.Args[1])
            http.HandleFunc("/", handler)
            http.ListenAndServe(":"+os.Args[1], nil)
        }
4. Compile the app for Linux 64bit:

        CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build
5. Create a `bin` directory and move the Linux binary into it - called `server` or something similar.

        mkdir bin
        mv APP_NAME bin/server
6. Create a simple `Procfile` in the project root to run the app under a web dyno.

        web: program $PORT
7. Add the app's `bin` directory to the PATH on Heroku:

        heroku config:set PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/app/bin
8. Commit the lot and push it to Heroku:

        git add --all
        git commit -m "First Commit"
        git push heroku master
9. Scale the app on Heroku:

        heroku ps:scale web=1
10. Open the app that's now running:

        heroku open

- - - 

## Todo
* Devise a way to keep the binary out of version control, likely using a temporary release branch to push to the Heroku master.
