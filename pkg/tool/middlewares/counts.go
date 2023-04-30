package middlewares

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"strings"
	"time"

	"github.com/doug-martin/goqu/v9"
)

func BuildCountsMiddleware(db *sql.DB, adminPath string) func(http.Handler) http.Handler {
	goquDB := goqu.New("postgres", db)

	ignorePattern := regexp.MustCompile(`\.(ico|css|js|jpeg|jpg|png)$`)

	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer h.ServeHTTP(w, r)

			if os.Getenv("GO_ENV") == "dev" {
				return
			}

			if r.Header.Get("HX-Preload") == "true" {
				return
			}

			if strings.HasSuffix(r.URL.Path, "-todo") {
				return
			}

			if strings.HasPrefix(r.URL.Path, adminPath) {
				return
			}

			if ignorePattern.MatchString(r.URL.Path) {
				return
			}

			bucket := time.Now().Format("2006-01")

			_, err := goquDB.Insert("personal_website.counts").
				Rows(
					goqu.Record{
						"key":    r.URL.String(),
						"bucket": bucket,
						"count":  1,
					}).
				OnConflict(
					goqu.DoUpdate(
						"key,bucket",
						goqu.Record{
							"count": goqu.L("counts.count + 1"),
						},
					),
				).Executor().Exec()

			if err != nil {
				fmt.Println("counts", err)
			}
		})
	}
}
