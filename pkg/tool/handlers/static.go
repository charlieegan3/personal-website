package handlers

import (
	"bytes"
	"embed"
	"fmt"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	"github.com/tdewolff/minify/v2/css"

	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/js"

	"github.com/charlieegan3/personal-website/pkg/tool/utils"
)

//go:embed static/*
var staticContent embed.FS

func BuildFaviconHandler() (handler func(http.ResponseWriter, *http.Request)) {
	bytes, err := staticContent.ReadFile("static/favicon.ico")
	if err != nil {
		panic(err)
	}

	etag := utils.CRC32Hash(bytes)

	return func(w http.ResponseWriter, req *http.Request) {
		if req.Header.Get("If-None-Match") == etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		w.Header().Set("ETag", etag)

		w.Write(bytes)
	}
}

func BuildRobotsHandler() (handler func(http.ResponseWriter, *http.Request)) {
	bytes, err := staticContent.ReadFile("static/robots.txt")
	if err != nil {
		panic(err)
	}

	etag := utils.CRC32Hash(bytes)

	return func(w http.ResponseWriter, req *http.Request) {
		if req.Header.Get("If-None-Match") == etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		w.Header().Set("ETag", etag)
		w.Header().Set("Content-Type", "text/plain")

		w.Write(bytes)
	}
}

func BuildStaticHandler() (handler func(http.ResponseWriter, *http.Request)) {
	return func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Cache-Control", "public, max-age=3600")

		rootedReq := http.Request{
			URL: &url.URL{
				Path: "./static/" + mux.Vars(req)["path"],
			},
		}
		http.FileServer(http.FS(staticContent)).ServeHTTP(w, &rootedReq)
	}
}

func BuildCSSHandler() (func(http.ResponseWriter, *http.Request), error) {
	sourceFileOrder := []string{"tachyons.css", "styles.css"}

	var bs []byte

	for _, f := range sourceFileOrder {
		fileBytes, err := staticContent.ReadFile("static/css/" + f)
		if err != nil {
			return nil, fmt.Errorf("failed to generate css: %s", err)
		}

		bs = append(bs, fileBytes...)
		bs = append(bs, []byte("\n")...)
	}

	in := bytes.NewBuffer(bs)
	out := bytes.NewBuffer([]byte{})

	m := minify.New()
	m.AddFunc("application/css", css.Minify)

	if err := m.Minify("application/css", out, in); err != nil {
		return nil, fmt.Errorf("failed to generate js: %s", err)
	}

	etag := utils.CRC32Hash(out.Bytes())

	return func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("If-None-Match") == etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		w.Header().Set("Content-Type", "text/css")
		w.Header().Set("ETag", etag)

		w.Write(out.Bytes())
	}, nil
}

func BuildJSHandler() (func(http.ResponseWriter, *http.Request), error) {
	sourceFileOrder := []string{"htmx.js", "htmx-preload.js", "script.js"}

	var bs []byte

	for _, f := range sourceFileOrder {
		fileBytes, err := staticContent.ReadFile("static/js/" + f)
		if err != nil {
			return nil, fmt.Errorf("failed to generate css: %s", err)
		}

		bs = append(bs, fileBytes...)
		bs = append(bs, []byte("\n")...)
	}

	in := bytes.NewBuffer(bs)
	out := bytes.NewBuffer([]byte{})

	m := minify.New()
	m.AddFunc("application/javascript", js.Minify)

	if err := m.Minify("application/javascript", out, in); err != nil {
		return nil, fmt.Errorf("failed to generate js: %s", err)
	}

	etag := utils.CRC32Hash(out.Bytes())

	return func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("If-None-Match") == etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		w.Header().Set("Content-Type", "application/javascript")
		w.Header().Set("ETag", etag)

		w.Write(out.Bytes())
	}, nil
}
