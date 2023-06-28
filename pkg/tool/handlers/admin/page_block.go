package admin

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"github.com/doug-martin/goqu/v9"
	"github.com/gorilla/mux"
)

func BuildPageBlockCreateHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		pageIDString, ok := mux.Vars(r)["pageID"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing pageID"))
			return
		}

		pageID, err := strconv.Atoi(pageIDString)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("pageID is not a number"))
			return
		}

		var count int
		_, err = goquDB.From("personal_website.page_blocks").
			Select(goqu.COUNT("id").As("count")).
			Where(goqu.C("page_id").Eq(pageID)).
			ScanVal(&count)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		fmt.Println("\ncount\n", count)

		_, err = goquDB.Insert("personal_website.page_blocks").Rows(
			goqu.Record{
				"page_id": pageID,
				"rank":    count + 1,
			},
		).Returning("id").Executor().Exec()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, pageID), http.StatusFound)
	}
}

func BuildPageBlockUpdateHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		strPageID := mux.Vars(r)["pageID"]

		if strPageID == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("pageID is required"))
			return
		}

		pageID, err := strconv.Atoi(strPageID)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("pageID is not a number"))
			return
		}

		strBlockID := mux.Vars(r)["blockID"]

		if strBlockID == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("blockID is required"))
			return
		}

		blockID, err := strconv.Atoi(strBlockID)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("blockID is not a number"))
			return
		}

		if r.FormValue("_method") == "DELETE" {
			_, err = goquDB.Delete("personal_website.page_blocks").Where(goqu.C("id").Eq(blockID)).Executor().Exec()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				return
			}

			http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, pageID), http.StatusFound)
			return
		}

		_, err = goquDB.Update("personal_website.page_blocks").
			Where(goqu.C("id").Eq(blockID), goqu.C("page_id").Eq(pageID)).
			Set(
				goqu.Record{
					"rank": r.FormValue("rank"),
					"col1": r.FormValue("col1"),
					"col2": r.FormValue("col2"),

					"left_image_name":    r.FormValue("left_image_name"),
					"left_image_caption": r.FormValue("left_image_caption"),
					"left_image_alt":     r.FormValue("left_image_alt"),

					"right_image_name":    r.FormValue("right_image_name"),
					"right_image_caption": r.FormValue("right_image_caption"),

					"right_image_alt":     r.FormValue("right_image_alt"),
					"intro_image_name":    r.FormValue("intro_image_name"),
					"intro_image_caption": r.FormValue("intro_image_caption"),
					"intro_image_alt":     r.FormValue("intro_image_alt"),

					"outro_image_name":    r.FormValue("outro_image_name"),
					"outro_image_caption": r.FormValue("outro_image_caption"),
					"outro_image_alt":     r.FormValue("outro_image_alt"),
				},
			).Returning("id").Executor().Exec()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, pageID), http.StatusFound)
	}
}
