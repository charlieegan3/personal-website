package status

import (
	"database/sql"
	"net/http"

	"github.com/foolin/goview"

	"github.com/charlieegan3/personal-website/pkg/tool/middlewares"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildNotFoundHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	return middlewares.BuildRedirectionHandler(db, func(w http.ResponseWriter, r *http.Request) {
		NotFound(w, r)
	})
}

func NotFound(w http.ResponseWriter, r *http.Request) {

	if r.Header.Get("HX-Request") == "true" {
		w.Header().Set("HX-Redirect", "/404")
		return
	}

	err := views.Engine.Render(
		w,
		http.StatusNotFound,
		"status/404",
		goview.M{},
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	}
}
