package admin

import (
	"net/http"

	"github.com/foolin/goview"

	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildIndexHandler(adminPath string) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := views.Engine.Render(
			w,
			http.StatusOK,
			"admin/index",
			goview.M{
				"admin_path": adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
