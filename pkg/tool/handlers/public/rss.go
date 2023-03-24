package public

import (
	"database/sql"
	"net/http"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildRSSHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)
	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var sections []types.Section
		err = goquDB.From("personal_website.sections").As("sections").
			Where(
				goqu.Ex{
					"sections.slug": goqu.Op{"neq": "unlisted"},
				},
				goqu.Ex{
					"sections.slug": goqu.Op{"neq": "talks"},
				},
			).
			Select("sections.*").
			Order(goqu.I("sections.name").Asc()).
			ScanStructs(&sections)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"public/rss",
			goview.M{
				"sections": &sections,
				"baseURL":  r.Host,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
