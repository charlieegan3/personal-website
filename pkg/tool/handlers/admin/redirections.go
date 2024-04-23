package admin

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gorilla/mux"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildRedirectionIndexHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var redirections []types.Redirection
		err = goquDB.From("personal_website.redirections").ScanStructs(&redirections)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/redirections/index",
			goview.M{
				"redirections": redirections,
				"admin_path":   adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildRedirectionNewHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var pages []types.Page
		err = goquDB.From("personal_website.pages").
			Select("id", "slug").
			ScanStructs(&pages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(fmt.Sprintf("error fetching pages: %s", err.Error())))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/redirections/new",
			goview.M{
				"pages":      pages,
				"admin_path": adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildRedirectionCreateHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		rec := goqu.Record{
			"source":      r.FormValue("source"),
			"destination": r.FormValue("destination"),
		}
		if r.FormValue("destination_page_id") != "" {
			rec["destination_page_id"] = r.FormValue("destination_page_id")
		}

		var id int
		_, err = goquDB.Insert("personal_website.redirections").Rows(rec).
			Returning("id").Executor().ScanVal(&id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/redirections", adminPath), http.StatusFound)
	}
}

func BuildRedirectionDeleteHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		redirectionID, ok := mux.Vars(r)["redirectionID"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("redirectionID is required"))
			return
		}

		_, err = goquDB.Delete("personal_website.redirections").
			Where(goqu.Ex{"id": redirectionID}).Executor().Exec()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/redirections", adminPath), http.StatusSeeOther)
	}
}
