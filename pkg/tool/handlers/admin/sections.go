package admin

import (
	"database/sql"
	"net/http"
	"strconv"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gorilla/mux"
	"github.com/gosimple/slug"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildSectionIndexHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var sections []types.Section

		err = goquDB.From("personal_website.sections").ScanStructs(&sections)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/sections/index",
			goview.M{
				"sections": sections,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildSectionNewHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/sections/new",
			goview.M{},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildSectionCreateHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var id int
		_, err = goquDB.Insert("personal_website.sections").Rows(
			goqu.Record{
				"name": r.FormValue("name"),
				"slug": slug.Make(r.FormValue("slug")),
			},
		).Returning("id").Executor().ScanVal(&id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, "/admin/sections", http.StatusFound)
	}
}

func BuildSectionUpdateHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		strID, ok := mux.Vars(r)["sectionID"]
		if !ok {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("No ID provided"))
			return
		}

		id, err := strconv.Atoi(strID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Invalid ID provided"))
			return
		}

		if r.FormValue("_method") == "DELETE" {
			_, err = goquDB.Delete("personal_website.sections").
				Where(goqu.C("id").Eq(id)).
				Executor().Exec()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				return
			}
		}

		http.Redirect(w, r, "/admin/sections", http.StatusFound)
	}
}
