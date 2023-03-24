package public

import (
	"database/sql"
	"encoding/xml"
	"fmt"
	"net/http"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gorilla/feeds"
	"github.com/gorilla/mux"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers/status"
	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

func BuildSectionShowHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		sectionSlug, ok := mux.Vars(r)["sectionSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing section"))
			return
		}

		if sectionSlug == "unlisted" {
			status.NotFound(w, r)
			return
		}

		// find the section
		var section types.Section
		found, err := goquDB.From("personal_website.sections").As("sections").
			Where(
				goqu.Ex{
					"sections.slug": sectionSlug,
				},
			).
			Select("sections.*").
			ScanStruct(&section)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if !found {
			status.NotFound(w, r)
			return
		}

		var pages []types.Page
		err = goquDB.From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"sections.id": goqu.I("pages.section_id"),
				}),
			).
			Where(
				goqu.Ex{
					"sections.slug":    sectionSlug,
					"pages.is_draft":   false,
					"pages.is_deleted": false,
				},
			).
			Order(goqu.I("pages.published_at").Desc(), goqu.I("pages.created_at").Desc()).
			Select("pages.*").
			ScanStructs(&pages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if len(pages) == 0 {
			status.NotFound(w, r)
			return
		}

		err = views.Engine.Render(
			w,
			http.StatusOK,
			"public/sections/show",
			goview.M{
				"section": &section,
				"pages":   &pages,
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildSectionRSSHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {

	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		sectionSlug, ok := mux.Vars(r)["sectionSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing section"))
			return
		}

		// find the section
		var section types.Section
		found, err := goquDB.From("personal_website.sections").As("sections").
			Where(
				goqu.Ex{
					"sections.slug": sectionSlug,
				},
			).
			Select("sections.*").
			ScanStruct(&section)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if !found {
			status.NotFound(w, r)
			return
		}

		var pages []types.Page
		err = goquDB.From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"sections.id": goqu.I("pages.section_id"),
				}),
			).
			Where(
				goqu.Ex{
					"sections.slug":    sectionSlug,
					"pages.is_draft":   false,
					"pages.is_deleted": false,
				},
			).
			Order(goqu.I("pages.published_at").Desc(), goqu.I("pages.created_at").Desc()).
			Select("pages.*").
			Limit(25).
			ScanStructs(&pages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if len(pages) == 0 {
			status.NotFound(w, r)
			return
		}

		feed := &feeds.Feed{
			Title:       fmt.Sprintf("charlieegan3.com - %s", section.Name),
			Link:        &feeds.Link{Href: r.URL.String()},
			Description: fmt.Sprintf("%s Feed", section.Name),
			Author:      &feeds.Author{Name: "Charlie Egan", Email: "me@charlieegan3.com"},
		}

		var feedItems []*feeds.Item
		for _, p := range pages {
			pageURL := fmt.Sprintf("https://%s/%s/%s", r.Host, sectionSlug, p.Slug)
			feedItems = append(feedItems,
				&feeds.Item{
					Id:          pageURL,
					Title:       p.Title,
					Link:        &feeds.Link{Href: pageURL},
					Description: string(views.MDFunc(p.Content)),
					Created:     p.PublishedAt,
				})
		}

		feed.Items = feedItems

		rssFeed := (&feeds.Rss{Feed: feed}).RssFeed()
		output, err := xml.MarshalIndent(rssFeed, "", "    ")
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		w.Write([]byte(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
`))
		w.Write([]byte(output))

		w.Write([]byte("\n</rss>"))
	}
}
