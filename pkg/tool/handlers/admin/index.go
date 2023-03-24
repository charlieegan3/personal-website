package admin

import (
	"github.com/charlieegan3/personal-website/pkg/tool/views"
	"github.com/foolin/goview"
	"net/http"
)

func BuildIndexHandler() func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := views.Engine.Render(
			w,
			http.StatusOK,
			"admin/index",
			goview.M{},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
