package public

import (
	"bytes"
	"database/sql"
	"fmt"
	"io"
	"net/http"

	"cloud.google.com/go/storage"
	"github.com/doug-martin/goqu/v9"
	"github.com/foolin/goview"
	"github.com/gorilla/mux"
	"github.com/skip2/go-qrcode"
	"google.golang.org/api/option"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers/status"
	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/utils"
	"github.com/charlieegan3/personal-website/pkg/tool/views"
)

var pageSectionTemplates = map[string]string{
	"talks": "public/pages/sections/talks",
}

func BuildPageShowHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		pageSlug, ok := mux.Vars(r)["pageSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing page"))
			return
		}

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
					"pages.slug":    pageSlug,
					"sections.slug": sectionSlug,
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

		if page.IsDeleted {
			status.NotFound(w, r)
			return
		}

		if page.ExternalURL() != "" {
			http.Redirect(w, r, page.ExternalURL(), http.StatusMovedPermanently)
			return
		}

		var prevPage types.Page
		_, err = goquDB.From("personal_website.pages").As("pages").
			Select("pages.*").
			Where(
				goqu.Ex{
					"pages.section_id": page.SectionID,
					"pages.is_deleted": false,
					"pages.is_draft":   false,
				},
				goqu.L("pages.data->>'external_url'").IsNull(),
				goqu.I("pages.published_at").Lt(page.PublishedAt),
			).
			Order(goqu.I("pages.published_at").Desc()).
			Limit(1).
			ScanStruct(&prevPage)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		var nextPage types.Page
		_, err = goquDB.From("personal_website.pages").As("pages").
			Select("pages.*").
			Where(
				goqu.Ex{
					"pages.section_id": page.SectionID,
					"pages.is_deleted": false,
					"pages.is_draft":   false,
				},
				goqu.L("pages.data->>'external_url'").IsNull(),
				goqu.I("pages.published_at").Gt(page.PublishedAt),
			).
			Order(goqu.I("pages.published_at").Asc()).
			Limit(1).
			ScanStruct(&nextPage)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		templatePath, ok := pageSectionTemplates[sectionSlug]
		if !ok {
			templatePath = "public/pages/show"
		}

		utils.SetCacheControl(w, "public, max-age=60")
		err = views.Engine.Render(
			w,
			http.StatusOK,
			templatePath,
			goview.M{
				"page":         &page,
				"url":          r.URL.Path,
				"prev":         &prevPage,
				"next":         &nextPage,
				"section":      sectionSlug,
				"menu_section": sectionSlug,
				"content": utils.ExpandImageSrcs(
					r.Host,
					utils.TemplateMD(page.Content, r.URL.Path),
					sectionSlug,
					pageSlug,
				),
			},
		)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
	}
}

func BuildPageAttachmentHandler(db *sql.DB, bucketName string, googleJSON string) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		storageClient, err := storage.NewClient(r.Context(), option.WithCredentialsJSON([]byte(googleJSON)))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		defer storageClient.Close()

		pageSlug, ok := mux.Vars(r)["pageSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing page"))
			return
		}

		sectionSlug, ok := mux.Vars(r)["sectionSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing section"))
			return
		}

		attachmentFilename, ok := mux.Vars(r)["attachmentFilename"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing attachment"))
			return
		}

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
					"pages.slug":    pageSlug,
					"sections.slug": sectionSlug,
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

		var attachment types.PageAttachment
		found, err = goquDB.From("personal_website.page_attachments").
			Where(
				goqu.Ex{
					"page_attachments.page_id":  page.ID,
					"page_attachments.filename": attachmentFilename,
				}).
			Executor().ScanStruct(&attachment)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		if !found {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("attachment not found"))
			return
		}

		w.Header().Set("HX-Redirect", r.URL.Path)
		w.Header().Set("Content-Type", attachment.ContentType)
		utils.SetCacheControl(w, "public, max-age=600")

		isImage := false
		for _, imageType := range []string{"image/png", "image/jpeg", "image/gif"} {
			if attachment.ContentType == imageType {
				isImage = true
				break
			}
		}

		if isImage {
			if r.Header.Get("If-None-Match") == attachment.Etag && attachment.Etag != "" {
				w.WriteHeader(http.StatusNotModified)
				w.Header().Set("ETag", attachment.Etag)
				return
			}
		}

		bkt := storageClient.Bucket(bucketName)
		obj := bkt.Object(fmt.Sprintf(
			"personal-website/pages/%d/attachments/%d/%s",
			page.ID,
			attachment.ID,
			attachment.Filename,
		))

		attrs, err := obj.Attrs(r.Context())
		if err == storage.ErrObjectNotExist {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("attachment not found"))
			return
		}
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		if attrs.Etag != attachment.Etag {
			_, err = goquDB.Update("personal_website.page_attachments").Where(goqu.Ex{
				"page_attachments.page_id":  page.ID,
				"page_attachments.filename": attachmentFilename,
			}).Set(goqu.Record{
				"etag": attrs.Etag,
			}).Executor().Exec()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				return
			}
		}

		if r.Header.Get("If-None-Match") == attrs.Etag {
			w.WriteHeader(http.StatusNotModified)
			return
		}

		if attrs.Etag != "" {
			w.Header().Set("ETag", attrs.Etag)
		}

		br, err := obj.NewReader(r.Context())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		defer br.Close()

		_, err = io.Copy(w, br)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}

func BuildPageQRHandler(db *sql.DB) func(http.ResponseWriter, *http.Request) {
	goquDB := goqu.New("postgres", db)

	return func(w http.ResponseWriter, r *http.Request) {
		var err error

		pageSlug, ok := mux.Vars(r)["pageSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing page"))
			return
		}

		sectionSlug, ok := mux.Vars(r)["sectionSlug"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing section"))
			return
		}

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
					"pages.slug":    pageSlug,
					"sections.slug": sectionSlug,
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

		w.Header().Set("Content-Type", "image/png")
		utils.SetCacheControl(w, "public, max-age=31536000, immutable")

		scheme := r.URL.Scheme
		if scheme == "" {
			scheme = "https"
		}

		permalink := fmt.Sprintf("%s://%s/%s/%s", scheme, r.Host, sectionSlug, pageSlug)

		bs, err := qrcode.Encode(permalink, qrcode.Medium, 256)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		_, err = io.Copy(w, bytes.NewReader(bs))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
	}
}
