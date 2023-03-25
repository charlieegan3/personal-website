package admin

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"cloud.google.com/go/storage"
	"github.com/doug-martin/goqu/v9"
	"github.com/gorilla/mux"
	"google.golang.org/api/option"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
)

func BuildPageAttachmentCreateHandler(db *sql.DB, bucketName string, googleJSON string, adminPath string) func(http.ResponseWriter, *http.Request) {

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

		filename := r.FormValue("filename")
		if filename == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("filename is required"))
			return
		}
		if r.FormValue("content_type") == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("content_type is required"))
			return
		}

		var attachmentID int
		_, err = goquDB.Insert("personal_website.page_attachments").Rows(
			goqu.Record{
				"page_id": pageID,

				"filename":     r.FormValue("filename"),
				"content_type": r.FormValue("content_type"),
			},
		).Returning("id").Executor().ScanVal(&attachmentID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		f, _, err := r.FormFile("file")
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("file missing"))
			return
		}
		if err == nil {
			bkt := storageClient.Bucket(bucketName)
			obj := bkt.Object(fmt.Sprintf("personal-website/pages/%d/attachments/%d/%s", pageID, attachmentID, filename))
			bw := obj.NewWriter(r.Context())
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("failed initialize attachment writer"))
				return
			}

			_, err = io.Copy(bw, f)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("failed to save attachment"))
				return
			}

			err = bw.Close()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte("failed to close connection to attachment storage"))
				return
			}
		}

		http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, pageID), http.StatusFound)
	}
}

func BuildPageAttachmentDeleteHandler(db *sql.DB, bucketName string, googleJSON string, adminPath string) func(http.ResponseWriter, *http.Request) {

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

		if r.FormValue("_method") != "DELETE" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("_method must be DELETE"))
			return
		}

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

		attachmentIDString, ok := mux.Vars(r)["attachmentID"]
		if !ok {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("missing attachmentID"))
			return
		}

		attachmentID, err := strconv.Atoi(attachmentIDString)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("attachmentID is not a number"))
			return
		}

		var attachment types.PageAttachment
		_, err = goquDB.From("personal_website.page_attachments").
			Where(goqu.C("id").Eq(attachmentID)).
			ScanStruct(&attachment)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		bkt := storageClient.Bucket(bucketName)
		obj := bkt.Object(fmt.Sprintf(
			"personal-website/pages/%d/attachments/%d/%s",
			pageID,
			attachmentID,
			attachment.Filename,
		))
		err = obj.Delete(r.Context())
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		_, err = goquDB.Delete("personal_website.page_attachments").
			Where(goqu.C("id").Eq(attachmentID)).
			Executor().Exec()
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}

		http.Redirect(w, r, fmt.Sprintf("%s/pages/%d", adminPath, pageID), http.StatusFound)
	}
}
