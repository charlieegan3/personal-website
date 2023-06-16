package admin

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gorilla/mux"
	"github.com/gosimple/slug"
	"gopkg.in/yaml.v3"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers/status"
	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/utils/mutate"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildPageIndexHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		var pages []types.Page

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

		q := goquDB.From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"pages.section_id": goqu.I("sections.id"),
				}),
			).Select("pages.*")

		// handle deleted param
		if r.URL.Query().Get("deleted") == "true" {
			q = q.Where(goqu.C("is_deleted").IsTrue())
		} else {
			q = q.Where(goqu.C("is_deleted").IsFalse())
		}

		//handle section param
		if section := r.URL.Query().Get("section"); section != "" {
			q = q.Where(goqu.L("sections.slug").Eq(section))
		}

		// handle draft param
		if r.URL.Query().Get("draft") == "true" {
			q = q.Where(goqu.C("is_draft").IsTrue())
		} else {
			q = q.Where(goqu.C("is_draft").IsFalse())
		}

		err = q.Order(
			goqu.I("is_draft").Desc(),
			goqu.I("published_at").Desc(),
		).ScanStructs(&pages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/pages/index",
			goview.M{
				"pages":      pages,
				"sections":   sectionMap,
				"admin_path": adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildPageNewHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {

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
			"admin/pages/new",
			goview.M{
				"sections":     sections,
				"default_time": time.Now().Format("2006-01-02T15:04"),
				"admin_path":   adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildPageCreateHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		if r.FormValue("published_at") == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("published_at is required"))
			return
		}

		var data map[string]interface{}
		err = yaml.Unmarshal([]byte(r.FormValue("data")), &data)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		jsonDataBytes, err := json.Marshal(data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		slugValue := r.FormValue("slug")
		if r.FormValue("is_draft") == "true" {
			if !strings.HasSuffix(slugValue, "-todo") {
				slugValue += "-todo"
			}
		} else {
			if strings.HasSuffix(slugValue, "-todo") {
				slugValue = strings.TrimSuffix(slugValue, "-todo")
			}
		}

		var id int
		_, err = goquDB.Insert("personal_website.pages").Rows(
			goqu.Record{
				"section_id": r.FormValue("section_id"),

				"title":   r.FormValue("title"),
				"slug":    slug.Make(slugValue),
				"content": r.FormValue("content"),

				"is_draft":     r.FormValue("is_draft") == "true",
				"is_protected": r.FormValue("is_protected") == "true",
				"is_deleted":   r.FormValue("is_deleted") == "true",

				"data": string(jsonDataBytes),

				"published_at": r.FormValue("published_at"),
			},
		).Returning("id").Executor().ScanVal(&id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, id), http.StatusFound)
	}
}

func BuildPageUpdateHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		strID := mux.Vars(r)["pageID"]

		if strID == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("pageID is required"))
			return
		}

		id, err := strconv.Atoi(strID)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("pageID is not a number"))
			return
		}

		if r.FormValue("_method") == "DELETE" {
			if r.FormValue("is_deleted") == "true" {
				_, err = goquDB.Delete("personal_website.pages").Where(goqu.C("id").Eq(id)).Executor().Exec()
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}
			} else {
				_, err = goquDB.Update("personal_website.pages").
					Where(goqu.C("id").Eq(id)).
					Set(goqu.Record{"is_deleted": true}).
					Executor().Exec()
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}
			}

			http.Redirect(w, r, fmt.Sprintf("%s/pages", adminPath), http.StatusFound)
			return
		}

		if r.FormValue("published_at") == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("published_at is required"))
			return
		}

		var data map[string]interface{}
		err = yaml.Unmarshal([]byte(r.FormValue("data")), &data)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte(err.Error()))
			return
		}

		jsonDataBytes, err := json.Marshal(data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		slugValue := r.FormValue("slug")
		if r.FormValue("is_draft") == "true" {
			if !strings.HasSuffix(slugValue, "-todo") {
				slugValue += "-todo"
			}
		} else {
			if strings.HasSuffix(slugValue, "-todo") {
				slugValue = strings.TrimSuffix(slugValue, "-todo")
			}
		}

		var attachments []types.PageAttachment
		err = goquDB.From("personal_website.page_attachments").Where(
			goqu.C("page_id").Eq(id),
		).ScanStructs(&attachments)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		content := mutate.ImageEtag(r.FormValue("content"), attachments)

		_, err = goquDB.Update("personal_website.pages").
			Where(goqu.C("id").Eq(id)).
			Set(
				goqu.Record{
					"id":         id,
					"section_id": r.FormValue("section_id"),

					"title":   r.FormValue("title"),
					"slug":    slug.Make(slugValue),
					"content": content,

					"is_draft":     r.FormValue("is_draft") == "true",
					"is_protected": r.FormValue("is_protected") == "true",
					"is_deleted":   r.FormValue("is_deleted") == "true",

					"data": string(jsonDataBytes),

					"published_at": r.FormValue("published_at"),
				},
			).Returning("id").Executor().ScanVal(&id)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, id), http.StatusFound)
	}
}

func BuildPageShowHandler(db *sql.DB, adminPath string) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		id, ok := mux.Vars(r)["pageID"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing pageID"))
			return
		}

		var sections []types.Section
		err = goquDB.From("personal_website.sections").ScanStructs(&sections)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		var page types.Page
		found, err := goquDB.From("personal_website.pages").Where(
			goqu.C("id").Eq(id),
		).ScanStruct(&page)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		if !found {
			status.NotFound(w, r)
			return
		}

		var pageSection types.Section
		found, err = goquDB.From("personal_website.sections").Where(
			goqu.C("id").Eq(page.SectionID),
		).ScanStruct(&pageSection)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		var attachments []types.PageAttachment
		err = goquDB.From("personal_website.page_attachments").Where(
			goqu.C("page_id").Eq(page.ID),
		).ScanStructs(&attachments)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"admin/pages/show",
			goview.M{
				"page":        &page,
				"pageSection": &pageSection,
				"sections":    &sections,
				"attachments": &attachments,
				"admin_path":  adminPath,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}
