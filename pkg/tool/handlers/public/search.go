package public

import (
	"database/sql"
	"net/http"
	"strings"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gosimple/slug"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildSearchHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)
	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		query, ok := r.URL.Query()["q"]
		if !ok || len(query[0]) < 1 {
			w.Header().Set("Cache-Control", "public, max-age=60")
			err = views.Engine.Render(
				w,
				http.StatusOK,
				"public/search/form",
				goview.M{
					"menu_section": "search",
				},
			)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
			}
			return
		}

		cleanedQuery := strings.Replace(slug.Make(query[0]), "-", " ", -1)
		if cleanedQuery == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("Invalid search query"))
			return
		}

		var pages []types.Page

		err = goquDB.From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.I("pages.section_id").Eq(goqu.I("sections.id"))),
			).
			Select(
				"pages.*",
			).
			Where(
				goqu.Ex{
					"sections.slug":    goqu.Op{"neq": "unlisted"},
					"pages.is_deleted": goqu.Op{"eq": false},
					"pages.is_draft":   goqu.Op{"eq": false},
				},
				goqu.Ex{
					"sections.slug": goqu.Op{"neq": "talks"},
				},
				goqu.L("pages.data->>'external_url'").IsNull(),
				goqu.Or(
					goqu.I("pages.title").ILike("%"+cleanedQuery+"%"),
					goqu.I("pages.content").ILike("%"+cleanedQuery+"%"),
				),
			).
			Order(
				goqu.L(`(SELECT count(*) FROM regexp_matches(pages.title, ?, 'g'))`, "(?i)"+cleanedQuery).Desc(),
				goqu.L(`(SELECT count(*) FROM regexp_matches(pages.content, ?, 'g'))`, "(?i)"+cleanedQuery).Desc(),
			).ScanStructs(&pages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		var sections []types.Section
		err = goquDB.From("personal_website.sections").ScanStructs(&sections)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		sectionMap := make(map[int]types.Section)
		for _, section := range sections {
			sectionMap[section.ID] = section
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"public/search/results",
			goview.M{
				"menu_section": "search",
				"query":        cleanedQuery,
				"pages":        &pages,
				"sections":     &sectionMap,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
