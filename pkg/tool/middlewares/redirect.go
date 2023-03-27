package middlewares

import (
	"database/sql"
	"net/http"

	"github.com/doug-martin/goqu/v9"
)

func BuildRedirectionHandler(db *sql.DB, callback func(http.ResponseWriter, *http.Request)) func(w http.ResponseWriter, r *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var redirections []string
		err := goquDB.From("personal_website.redirections").
			As("redirections").
			Select(
				goqu.COALESCE(
					goqu.L(`NULLIF("redirections"."destination", '')`),
					goqu.L(`CONCAT('/', "sections".slug, '/', "pages".slug)`),
				).As("destination"),
			).
			FullOuterJoin(
				goqu.S("personal_website").Table("pages").As("pages"),
				goqu.On(goqu.Ex{
					"pages.id": goqu.I("redirections.destination_page_id"),
				}),
			).
			FullOuterJoin(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"sections.id": goqu.I("pages.section_id"),
				}),
			).
			Where(
				goqu.Ex{
					"redirections.source": r.URL.Path,
				},
			).ScanVals(&redirections)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if len(redirections) > 0 {
			http.Redirect(w, r, redirections[0], http.StatusMovedPermanently)
			return
		}

		callback(w, r)
	}
}
func BuildRedirectMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			BuildRedirectionHandler(db, func(writer http.ResponseWriter, req *http.Request) {
				h.ServeHTTP(writer, req)
			})(w, r)
		})
	}
}
