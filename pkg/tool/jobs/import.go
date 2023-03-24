package jobs

import (
	"bytes"
	"context"
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"github.com/doug-martin/goqu/v9"
	"google.golang.org/api/option"
	"gopkg.in/yaml.v3"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
)

// Import is a job that copies the data in the bq table to GCS
type Import struct {
	DB *sql.DB

	GoogleCredentialsJSON string
	BucketName            string

	SourcePath string
	SectionRef string
}

func (b *Import) Name() string {
	return "import"
}

func (b *Import) Run(ctx context.Context) error {
	var err error

	// create the storage client
	storageClient, err := storage.NewClient(
		ctx,
		option.WithCredentialsJSON([]byte(b.GoogleCredentialsJSON)),
	)
	if err != nil {
		log.Fatalf("failed to create storage client: %s", err)
	}
	defer storageClient.Close()
	bkt := storageClient.Bucket(b.BucketName)

	_, err = storageClient.Bucket(b.BucketName).Attrs(ctx)
	if err != nil {
		return fmt.Errorf("failed to get bucket attributes: %s", err)
	}

	// check the section that we're importing
	if b.SectionRef == "" {
		parts := strings.Split(b.SourcePath, "/")
		b.SectionRef = parts[len(parts)-1]
	}

	// init db
	db := goqu.New("postgres", b.DB)

	// find the section in the database
	var section types.Section
	found, err := db.From("personal_website.sections").
		Where(goqu.C("slug").Eq(b.SectionRef)).
		ScanStruct(&section)
	if err != nil {
		return fmt.Errorf("failed to find section: %s", err)
	}

	if !found {
		return fmt.Errorf("section not found: %s", b.SectionRef)
	}

	// find the pageDirs to import
	pageDir, err := os.ReadDir(b.SourcePath)
	if err != nil {
		return fmt.Errorf("failed to read directory: %s", err)
	}

	for _, pageDir := range pageDir {
		if !pageDir.IsDir() {
			continue
		}
		// find the page source files and attachments
		files, err := os.ReadDir(fmt.Sprintf("%s/%s", b.SourcePath, pageDir.Name()))
		if err != nil {
			return fmt.Errorf("failed to read directory: %s", err)
		}

		if len(files) == 0 {
			continue
		}

		// load the contents and attachments
		var rawContent string
		var attachments []types.PageAttachment
		for _, file := range files {
			if file.IsDir() {
				return fmt.Errorf("unexpected directory: %s", file.Name())
			}
			if file.Name() == ".DS_Store" {
				continue
			}
			if file.Name() == "index.md" {
				bs, err := os.ReadFile(fmt.Sprintf("%s/%s/%s", b.SourcePath, pageDir.Name(), file.Name()))
				if err != nil {
					return fmt.Errorf("failed to read file: %s", err)
				}
				rawContent = string(bs)
				continue
			}

			var contentType string
			if strings.HasSuffix(file.Name(), ".jpg") || strings.HasSuffix(file.Name(), ".jpeg") {
				contentType = "image/jpeg"
			} else if strings.HasSuffix(file.Name(), ".png") {
				contentType = "image/png"
			} else if strings.HasSuffix(file.Name(), ".pdf") {
				contentType = "application/pdf"
			} else if strings.HasSuffix(file.Name(), ".gif") {
				contentType = "image/gif"
			} else if strings.HasSuffix(file.Name(), ".csv") {
				contentType = "text/csv"
			} else if strings.HasSuffix(file.Name(), ".zip") {
				contentType = "application/zip"
			} else {
				return fmt.Errorf("unexpected file type: %s", file.Name())
			}

			attachments = append(attachments, types.PageAttachment{
				Filename:    file.Name(),
				ContentType: contentType,
			})
		}

		// extract and format all the page data
		var pageData, content string
		var re = regexp.MustCompile(`(?ms)\-\-\-\n.*\-\-\-\n`)
		for _, match := range re.FindAllString(rawContent, 1) {
			pageData = strings.TrimSpace(strings.Replace(match, "---", "", 2))
			content = strings.TrimSpace(strings.Replace(rawContent, match, "", 1))
		}
		if pageData == "" {
			return fmt.Errorf("failed to find page data: %s", pageDir.Name())
		}

		hg := struct {
			Title   string   `yaml:"title"`
			Date    string   `yaml:"date"`
			Aliases []string `yaml:"aliases"`
		}{}
		err = yaml.Unmarshal([]byte(pageData), &hg)
		if err != nil {
			return fmt.Errorf("failed to unmarshal page data for page %s: %s", pageDir.Name(), err)
		}

		var date time.Time
		if hg.Date != "" {
			date, err = time.Parse("2006-01-02 15:04:05 -0700", hg.Date)
			if err != nil {
				return fmt.Errorf("failed to parse date: %s", err)
			}
		}

		allData := make(map[string]interface{})
		err = yaml.Unmarshal([]byte(pageData), &allData)
		if err != nil {
			return fmt.Errorf("failed to unmarshal all page data for page %s: %s", pageDir.Name(), err)
		}

		jsonData, err := json.Marshal(allData)
		if err != nil {
			return fmt.Errorf("failed to marshal all page data for page %s: %s", pageDir.Name(), err)
		}

		slug := pageDir.Name()

		// upsert the page based on the slug
		rec := goqu.Record{
			"section_id":   section.ID,
			"slug":         slug,
			"title":        hg.Title,
			"published_at": date,
			"content":      content,
			"data":         string(jsonData),
		}
		var pageID int
		_, err = db.Insert("personal_website.pages").
			Rows(rec).
			OnConflict(goqu.DoUpdate("slug", rec)).
			Returning("id").
			Executor().ScanVal(&pageID)
		if err != nil {
			return fmt.Errorf("failed to insert page: %s", err)
		}

		// upsert the page redirects
		for _, alias := range hg.Aliases {
			rec = goqu.Record{
				"source":              strings.TrimSuffix(alias, "/"),
				"destination_page_id": pageID,
				"destination":         "",
			}
			_, err = db.Insert("personal_website.redirections").
				Rows(rec).
				OnConflict(goqu.DoUpdate("source", rec)).
				Executor().Exec()
			if err != nil {
				return fmt.Errorf("failed to insert page redirect: %s", err)
			}
		}

		// upload the page attachments
		for _, attachment := range attachments {

			var existingAttachmentID int
			_, err = db.From("personal_website.page_attachments").
				Where(goqu.C("page_id").Eq(pageID)).
				Where(goqu.C("filename").Eq(attachment.Filename)).
				Select("id").
				Executor().ScanVal(&existingAttachmentID)
			if err != nil {
				return fmt.Errorf("failed to find existing attachment: %s", err)
			}

			if existingAttachmentID == 0 {
				rec = goqu.Record{
					"page_id":      pageID,
					"filename":     attachment.Filename,
					"content_type": attachment.ContentType,
				}

				_, err = db.Insert("personal_website.page_attachments").
					Rows(rec).
					Returning("id").
					Executor().ScanVal(&existingAttachmentID)
				if err != nil {
					return fmt.Errorf("failed to insert page attachment: %s", err)
				}
			}

			if existingAttachmentID == 0 {
				return fmt.Errorf("failed to find existing attachment")
			}

			path := fmt.Sprintf(
				"personal-website/pages/%d/attachments/%d/%s",
				pageID,
				existingAttachmentID,
				attachment.Filename,
			)

			bs, err := os.ReadFile(filepath.Join(b.SourcePath, pageDir.Name(), attachment.Filename))
			if err != nil {
				return fmt.Errorf("failed to read attachment: %s", err)
			}

			hash := md5.Sum(bs)
			localDigest := hex.EncodeToString(hash[:])

			attrs, err := bkt.Object(path).Attrs(ctx)
			if err != nil && err != storage.ErrObjectNotExist {
				return fmt.Errorf("failed to check attachment storage: %s", err)
			}

			bucketDigest := ""
			if attrs != nil {
				bucketDigest = hex.EncodeToString(attrs.MD5)
			}

			if bucketDigest != localDigest {
				fmt.Println("uploading", path)
				obj := bkt.Object(path)
				bw := obj.NewWriter(ctx)

				_, err = io.Copy(bw, bytes.NewReader(bs))
				if err != nil {
					return fmt.Errorf("failed to upload attachment: %s", err)
				}

				err = bw.Close()
				if err != nil {
					return fmt.Errorf("failed to close attachment upload: %s", err)
				}
			}
		}

		fmt.Println(pageID)
	}

	return nil
}

func (b *Import) Timeout() time.Duration {
	return 3600 * time.Second
}

func (b *Import) Schedule() string {
	return ""
}
