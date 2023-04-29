package admin

import (
	"database/sql"
	"net/http"
	"time"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"

	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildCountsIndexHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var counts []struct {
			Bucket string
			Key    string
			Count  int
		}
		err = goquDB.From(
			goquDB.From("personal_website.counts").
				Select("key", "bucket", "count", goqu.L("ROW_NUMBER () OVER (PARTITION BY bucket ORDER BY count DESC) as rn")).
				Where(
					goqu.C("bucket").ILike(time.Now().Format("2006")+"%"),
					goqu.C("key").NotILike("%.rss"),
					goqu.C("key").NotILike("%.txt"),
					goqu.C("key").Neq("/search"),
				).
				Order(
					goqu.C("bucket").Desc(),
					goqu.C("count").Desc(),
				),
		).
			Where(goqu.C("rn").Lte(10)).
			Order(goqu.C("bucket").Desc(), goqu.C("count").Desc()).
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
