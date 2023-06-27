package admin

import (
	"bytes"
	"database/sql"
	"fmt"
	"image"
	"image/jpeg"
	"io"
	"net/http"
	"strconv"
	"strings"

	"cloud.google.com/go/storage"
	"github.com/disintegration/imaging"
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

		contentType := r.FormValue("content_type")
		if contentType == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("content_type is required"))
			return
		}
		filename := r.FormValue("filename")
		if filename == "" {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("filename is required"))
			return
		}

		switch contentType {
		case "image/jpeg":
			if strings.HasSuffix(filename, ".jpeg") {
				filename = strings.TrimSuffix(filename, ".jpeg")
			}
			if !strings.HasSuffix(filename, ".jpg") {
				filename = fmt.Sprintf("%s.jpg", filename)
			}
		case "image/x-png":
			if !strings.HasSuffix(filename, ".png") {
				filename = fmt.Sprintf("%s.png", filename)
			}
		case "image/gif":
			if !strings.HasSuffix(filename, ".gif") {
				filename = fmt.Sprintf("%s.gif", filename)
			}
		case "application/pdf":
			if !strings.HasSuffix(filename, ".pdf") {
				filename = fmt.Sprintf("%s.pdf", filename)
			}
		case "application/zip":
			if !strings.HasSuffix(filename, ".zip") {
				filename = fmt.Sprintf("%s.zip", filename)
			}
		case "text/csv":
			if !strings.HasSuffix(filename, ".csv") {
				filename = fmt.Sprintf("%s.csv", filename)
			}
		}

		var attachmentID int
		_, err = goquDB.Insert("personal_website.page_attachments").Rows(
			goqu.Record{
				"page_id":      pageID,
				"filename":     filename,
				"content_type": contentType,
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

			buf := new(bytes.Buffer)

			if contentType == "image/jpeg" {
				img, _, err := image.Decode(f)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte("failed to decode image"))
					return
				}

				bnds := img.Bounds()
				var resizedImg *image.NRGBA
				if bnds.Max.X > bnds.Max.Y {
					resizedImg = imaging.Resize(img, 2000, 0, imaging.Lanczos)
				} else {
					resizedImg = imaging.Resize(img, 0, 2000, imaging.Lanczos)
				}
				err = jpeg.Encode(buf, resizedImg, nil)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte("failed to encode image"))
					return
				}
			} else {
				_, err = io.Copy(buf, f)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte("failed to read attachment"))
					return
				}
			}

			_, err = io.Copy(bw, buf)
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

			// update the etag
			attrs, err := obj.Attrs(r.Context())
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				return
			}
			_, err = goquDB.Update("personal_website.page_attachments").Where(goqu.Ex{
				"page_attachments.page_id":  pageID,
				"page_attachments.filename": filename,
			}).Set(goqu.Record{
				"etag": attrs.Etag,
			}).Executor().Exec()
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
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
