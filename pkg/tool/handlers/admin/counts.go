package admin

import (
	"database/sql"
	"net/http"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"

	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildCountsIndexHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var counts []struct {
			Key   string
			Count int
		}
		err = goquDB.From("personal_website.counts").
			GroupBy("key").
			Select("key", goqu.L("sum(count) as count")).
			Order(goqu.C("count").Desc()).
			Limit(25).
			ScanStructs(&counts)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/counts/index",
			goview.M{
				"counts":     counts,
				"admin_path": adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
