package public

import (
	"database/sql"
	"net/http"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers/status"
	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildIndexHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)
	return func(w http.ResponseWriter, r *http.Request) {

		var page types.Page
		found, err := goquDB.From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"sections.id": goqu.I("pages.section_id"),
				}),
			).
			Where(
				goqu.Ex{
					"pages.slug":    "index",
					"sections.slug": "unlisted",
				},
			).
			Select("pages.*").
			ScanStruct(&page)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if !found {
			status.NotFound(w, r)
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"public/index",
			goview.M{
				"page": &page,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
