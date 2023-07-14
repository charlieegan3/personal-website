package public

import (
	"bytes"
	"database/sql"
	"encoding/xml"
	"fmt"
	"net/http"
	"strconv"

	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gorilla/feeds"
	"github.com/gorilla/mux"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers/status"
	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/utils"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

var sectionTemplates = map[string]string{
	"talks": "public/sections/talks",
}

const pageSize = int(7)

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

		var includeExternal bool
		includeExternalValue, ok := r.URL.Query()["include_external"]
		if ok && len(includeExternalValue) > 0 && includeExternalValue[0] == "true" {
			includeExternal = true
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

		rawPage := r.URL.Query().Get("page")
		var page int
		if rawPage := r.URL.Query().Get("page"); rawPage != "" {
			page, err = strconv.Atoi(rawPage)
			if err != nil {
				w.WriteHeader(http.StatusBadRequest)
				w.Write([]byte("invalid page param"))
				return
			}
			page -= 1
		}
		if page < 0 {
			page = 0
		}

		if page == 0 && rawPage != "" {
			http.Redirect(w, r, fmt.Sprintf("/%s", sectionSlug), http.StatusFound)
			return
		}

		whereArgs := []goqu.Expression{
			goqu.Ex{
				"sections.slug":    sectionSlug,
				"pages.is_draft":   false,
				"pages.is_deleted": false,
			},
		}
		if !includeExternal {
			whereArgs = append(whereArgs, goqu.L("pages.data->>'external_url'").IsNull())
		}

		// count the total number of pages
		var totalPages int
		_, err = goquDB.From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"sections.id": goqu.I("pages.section_id"),
				}),
			).
			Where(whereArgs...).
			Select(goqu.L("count(pages.id)")).
			ScanVal(&totalPages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if page*pageSize > totalPages {
			http.Redirect(w, r, fmt.Sprintf("/%s?page=%d", sectionSlug, (totalPages/pageSize)+1), http.StatusFound)
			return
		}

		// load the pages for the section, loading block data where needed
		var pages []types.Page
		q := goquDB.Select("pages.*", goqu.L("array_to_string(ARRAY_AGG(array_to_string(ARRAY[blocks.col1, blocks.col2], E'\n')), E'\n') as block_content")).
			From("personal_website.pages").As("pages").
			Join(
				goqu.S("personal_website").Table("sections").As("sections"),
				goqu.On(goqu.Ex{
					"sections.id": goqu.I("pages.section_id"),
				}),
			).
			FullOuterJoin(
				goqu.L("blocks"),
				goqu.On(goqu.Ex{
					"blocks.page_id": goqu.I("pages.id"),
				}),
			).
			Where(whereArgs...).
			GroupBy(goqu.I("pages.id")).
			Order(goqu.I("pages.published_at").Desc()).
			Offset(uint(page*pageSize)).
			Limit(uint(pageSize)).
			With(
				"blocks",
				goquDB.Select("*").
					From("personal_website.page_blocks").
					Order(goqu.I("page_id").Asc(), goqu.I("rank").Asc()),
			)
		fmt.Println(q.ToSQL())
		err = q.Executor().ScanStructs(&pages)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if len(pages) == 0 {
			status.NotFound(w, r)
			return
		}

		pageData := goview.M{
			"section":          &section,
			"pages":            &pages,
			"menu_section":     sectionSlug,
			"include_external": includeExternal,
		}

		if page > 0 {
			pageData["prevPage"] = page
		}

		if (page+1)*pageSize < totalPages {
			pageData["nextPage"] = page + 2
		}

		templatePath, ok := sectionTemplates[sectionSlug]
		if !ok {
			templatePath = "public/sections/show"
		}

		utils.SetCacheControl(w, "public, max-age=60")
		err = views.Engine.Render(
			w,
			http.StatusOK,
			templatePath,
			pageData,
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

		var pageIDs []int
		for _, p := range pages {
			pageIDs = append(pageIDs, p.ID)
		}

		var blocks []types.PageBlock
		q := goquDB.Select("page_blocks.*").
			From("personal_website.page_blocks").
			Where(
				goqu.Ex{
					"page_blocks.page_id": pageIDs,
				},
			)
		err = q.ScanStructs(&blocks)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		allocatedBlocks := make(map[int]bool)
		for i, p := range pages {
			for _, b := range blocks {
				if _, ok := allocatedBlocks[b.ID]; ok {
					continue
				}
				if b.PageID == p.ID {
					pages[i].Blocks = append(pages[i].Blocks, b)
					allocatedBlocks[b.ID] = true
				}
			}
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

			var buf bytes.Buffer

			err = views.RSSEngine.RenderWriter(
				&buf,
				"public/pages/show-rss",
				goview.M{
					"page":    &p,
					"blocks":  &p.Blocks,
					"url":     r.URL.Path,
					"section": sectionSlug,
					"path":    r.URL.Path,
					"content": utils.ExpandImageSrcs(
						r.Host,
						utils.TemplateMD(p.Content, r.URL.Path),
						sectionSlug,
						p.Slug,
					),
				},
			)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				return
			}

			feedItems = append(feedItems,
				&feeds.Item{
					Id:          pageURL,
					Title:       p.Title,
					Link:        &feeds.Link{Href: pageURL},
					Description: buf.String(),
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
		w.Write(output)

		w.Write([]byte("\n</rss>"))
	}
}
