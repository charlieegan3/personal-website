package tool

import (
	"database/sql"
	"embed"
	"fmt"
	"net/http"

	"github.com/Jeffail/gabs/v2"
	"github.com/charlieegan3/toolbelt/pkg/apis"
	"github.com/gorilla/mux"
	_ "gocloud.dev/blob/fileblob"
	_ "gocloud.dev/blob/gcsblob"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers"
	"github.com/charlieegan3/personal-website/pkg/tool/handlers/admin"
	"github.com/charlieegan3/personal-website/pkg/tool/handlers/public"
	"github.com/charlieegan3/personal-website/pkg/tool/handlers/status"
	"github.com/charlieegan3/personal-website/pkg/tool/middlewares"
)

//go:embed migrations
var migrations embed.FS

// Website is a tool that runs my personal site
type Website struct {
	db     *sql.DB
	config *gabs.Container

	bucketName string
	googleJSON string
}

func (w *Website) Name() string {
	return "personal-website"
}

func (w *Website) FeatureSet() apis.FeatureSet {
	return apis.FeatureSet{
		HTTP:     true,
		HTTPHost: true,
		Config:   true,
		Database: true,
	}
}

func (w *Website) DatabaseMigrations() (*embed.FS, string, error) {
	return &migrations, "migrations", nil
}

func (w *Website) DatabaseSet(db *sql.DB) {
	w.db = db
}

func (w *Website) SetConfig(config map[string]any) error {
	var ok bool
	var path string
	w.config = gabs.Wrap(config)

	path = "storage.bucket_name"
	w.bucketName, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	path = "google.json"
	w.googleJSON, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	return nil
}

func (w *Website) Jobs() ([]apis.Job, error) { return []apis.Job{}, nil }

func (w *Website) HTTPAttach(router *mux.Router) error {

	path := "web.auth.username"
	username, ok := w.config.Path(path).Data().(string)
	if !ok {
		username = "example"
	}

	path = "web.auth.password"
	password, ok := w.config.Path(path).Data().(string)
	if !ok {
		password = "example"
	}

	router.StrictSlash(true)
	adminRouter := router.PathPrefix("/admin").Subrouter()
	adminRouter.StrictSlash(true) // since not inherited
	adminRouter.Use(middlewares.InitMiddlewareAuth(username, password))

	// admin routes -------------------------------------

	adminRouter.HandleFunc("/sections/new", admin.BuildSectionNewHandler(w.db))
	adminRouter.HandleFunc("/sections/{sectionID}", admin.BuildSectionUpdateHandler(w.db)).
		Methods("POST")
	adminRouter.HandleFunc("/sections", admin.BuildSectionCreateHandler(w.db)).
		Methods("POST")
	adminRouter.HandleFunc("/sections", admin.BuildSectionIndexHandler(w.db))
	adminRouter.HandleFunc("/redirections", admin.BuildRedirectionIndexHandler(w.db)).
		Methods("GET")
	adminRouter.HandleFunc("/redirections", admin.BuildRedirectionCreateHandler(w.db)).
		Methods("POST")
	adminRouter.HandleFunc("/redirections/new", admin.BuildRedirectionNewHandler(w.db))
	adminRouter.HandleFunc("/redirections/{redirectionID}", admin.BuildRedirectionDeleteHandler(w.db)).
		Methods("POST")

	adminRouter.HandleFunc("/pages/new", admin.BuildPageNewHandler(w.db))
	adminRouter.HandleFunc("/pages/{pageID}", admin.BuildPageShowHandler(w.db)).
		Methods("GET")
	adminRouter.HandleFunc("/pages/{pageID}", admin.BuildPageUpdateHandler(w.db)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/attachments", admin.BuildPageAttachmentCreateHandler(w.db, w.bucketName, w.googleJSON)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/attachments/{attachmentID}", admin.BuildPageAttachmentDeleteHandler(w.db, w.bucketName, w.googleJSON)).
		Methods("POST")
	adminRouter.HandleFunc("/pages", admin.BuildPageIndexHandler(w.db)).
		Methods("GET")
	adminRouter.HandleFunc("/pages", admin.BuildPageCreateHandler(w.db)).
		Methods("POST")

	adminRouter.HandleFunc("/", admin.BuildIndexHandler())

	// public routes ------------------------------------
	cssHandler, err := handlers.BuildCSSHandler()
	if err != nil {
		return err
	}
	router.HandleFunc("/styles.css", cssHandler).Methods("GET")

	jsHandler, err := handlers.BuildJSHandler()
	if err != nil {
		return err
	}
	router.HandleFunc("/script.js", jsHandler).Methods("GET")

	router.HandleFunc(
		"/static/{path:.*}",
		handlers.BuildStaticHandler(),
	).Methods("GET")

	router.HandleFunc("/search", public.BuildSearchHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/rss", public.BuildRSSHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}.rss", public.BuildSectionRSSHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}", public.BuildSectionShowHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}/{pageSlug}", public.BuildPageShowHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}/{pageSlug}/{attachmentFilename}", public.BuildPageAttachmentHandler(w.db, w.bucketName, w.googleJSON)).
		Methods("GET")
	router.HandleFunc("/", public.BuildIndexHandler(w.db)).
		Methods("GET")

	router.Use(middlewares.BuildRedirectMiddleware(w.db))
	router.Use(middlewares.BuildCountsMiddleware(w.db))
	router.NotFoundHandler = http.HandlerFunc(status.NotFound)

	return nil
}
func (w *Website) HTTPHost() string {
	path := "web.host"
	host, ok := w.config.Path(path).Data().(string)
	if !ok {
		return "example.com"
	}
	return host
}
func (w *Website) HTTPPath() string { return "" }

func (w *Website) ExternalJobsFuncSet(f func(job apis.ExternalJob) error) {}
