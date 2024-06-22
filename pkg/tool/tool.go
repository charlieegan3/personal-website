package tool

import (
	"context"
	"database/sql"
	"embed"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/Jeffail/gabs/v2"
	"github.com/coreos/go-oidc"
	gorillaHandlers "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "gocloud.dev/blob/fileblob"
	_ "gocloud.dev/blob/gcsblob"
	"golang.org/x/oauth2"

	"github.com/charlieegan3/oauth-middleware/pkg/oauthmiddleware"
	"github.com/charlieegan3/toolbelt/pkg/apis"

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

	host   string
	scheme string

	adminPath            string
	adminParam           string
	permittedEmailSuffix string

	oauth2Config    *oauth2.Config
	oidcProvider    *oidc.Provider
	idTokenVerifier *oidc.IDTokenVerifier
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
	w.adminPath = "/admin/"

	var ok bool
	var path string
	w.config = gabs.Wrap(config)

	path = "web.host"
	w.host, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	path = "web.https"
	isHttps, ok := w.config.Path(path).Data().(bool)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	w.scheme = "https://"
	if !isHttps {
		w.scheme = "http://"
	}

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

	path = "web.admin_param"
	w.adminParam, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	path = "web.auth.provider_url"
	providerURL, ok := w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	var err error
	w.oidcProvider, err = oidc.NewProvider(context.TODO(), providerURL)
	if err != nil {
		return fmt.Errorf("failed to create oidc provider: %w", err)
	}

	w.oauth2Config = &oauth2.Config{
		Endpoint: w.oidcProvider.Endpoint(),
	}

	path = "web.auth.client_id"
	w.oauth2Config.ClientID, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	path = "web.auth.client_secret"
	w.oauth2Config.ClientSecret, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	w.oauth2Config.RedirectURL = w.scheme + w.host + "/admin/auth/callback"

	// offline_access is required for refresh tokens
	w.oauth2Config.Scopes = []string{oidc.ScopeOpenID, "profile", "email", "offline_access"}

	w.idTokenVerifier = w.oidcProvider.Verifier(&oidc.Config{ClientID: w.oauth2Config.ClientID})

	path = "web.auth.permitted_email_suffix"
	w.permittedEmailSuffix, ok = w.config.Path(path).Data().(string)
	if !ok {
		return fmt.Errorf("config value %s not set", path)
	}

	return nil
}

func (w *Website) Jobs() ([]apis.Job, error) { return []apis.Job{}, nil }

func (w *Website) HTTPAttach(router *mux.Router) error {
	router.StrictSlash(true)

	mw, err := oauthmiddleware.Init(&oauthmiddleware.Config{
		OAuth2Connector: w.oauth2Config,
		IDTokenVerifier: w.idTokenVerifier,
		Validators: []oauthmiddleware.IDTokenValidator{
			func(token *oidc.IDToken) (map[any]any, bool) {
				c := struct {
					Email string `json:"email"`
				}{}

				err := token.Claims(&c)
				if err != nil {
					return nil, false
				}

				if w.permittedEmailSuffix == "" {
					log.Println("email suffix was blank and so no emails are allowed")
					return nil, false
				}

				if !strings.HasSuffix(c.Email, w.permittedEmailSuffix) {
					log.Printf("email %s does not have suffix %s", c.Email, w.permittedEmailSuffix)

					return nil, false
				}

				return map[any]any{"email": c.Email}, true
			},
		},
		AuthBasePath:     w.adminPath,
		CallbackBasePath: w.adminPath,
		BeginParam:       w.adminParam,
	})
	if err != nil {
		return fmt.Errorf("failed to init oauth middleware: %w", err)
	}

	adminRouter := router.PathPrefix(w.adminPath).Subrouter()
	adminRouter.StrictSlash(true) // since not inherited
	adminRouter.Use(mw)
	adminRouter.HandleFunc("/auth/callback", func(w http.ResponseWriter, r *http.Request) {
		// should be handled by middleware, but here to avoid 404 and the middleware not
		// being run
	})

	// admin routes -------------------------------------

	adminRouter.HandleFunc("/sections/new", admin.BuildSectionNewHandler(w.adminPath))
	adminRouter.HandleFunc("/sections/{sectionID}", admin.BuildSectionUpdateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/sections", admin.BuildSectionCreateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/sections", admin.BuildSectionIndexHandler(w.db, w.adminPath))
	adminRouter.HandleFunc("/redirections", admin.BuildRedirectionIndexHandler(w.db, w.adminPath)).
		Methods("GET")
	adminRouter.HandleFunc("/redirections", admin.BuildRedirectionCreateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/redirections/new", admin.BuildRedirectionNewHandler(w.db, w.adminPath))
	adminRouter.HandleFunc("/redirections/{redirectionID}", admin.BuildRedirectionDeleteHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/counts", admin.BuildCountsIndexHandler(w.db, w.adminPath)).
		Methods("GET")

	adminRouter.HandleFunc("/pages/new", admin.BuildPageNewHandler(w.db, w.adminPath))
	adminRouter.HandleFunc("/pages/{pageID}", admin.BuildPageShowHandler(w.db, w.adminPath)).
		Methods("GET")
	adminRouter.HandleFunc("/pages/{pageID}", admin.BuildPageUpdateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/attachments", admin.BuildPageAttachmentCreateHandler(w.db, w.bucketName, w.googleJSON, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/attachments/{attachmentID}", admin.BuildPageAttachmentDeleteHandler(w.db, w.bucketName, w.googleJSON, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/blocks", admin.BuildPageBlockCreateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/blocks/{blockID}", admin.BuildPageBlockUpdateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/pages/{pageID}/blocks/{blockID}", admin.BuildPageBlockUpdateHandler(w.db, w.adminPath)).
		Methods("POST")
	adminRouter.HandleFunc("/pages", admin.BuildPageIndexHandler(w.db, w.adminPath)).
		Methods("GET")
	adminRouter.HandleFunc("/pages", admin.BuildPageCreateHandler(w.db, w.adminPath)).
		Methods("POST")

	adminRouter.HandleFunc("/", admin.BuildIndexHandler(w.adminPath))
	adminRouter.HandleFunc("/auth/callback", func(w http.ResponseWriter, r *http.Request) {
		// should be handled by middleware, but here to avoid 404
	})

	// public routes ------------------------------------
	router.HandleFunc("/favicon.ico", handlers.BuildFaviconHandler())
	router.HandleFunc("/robots.txt", handlers.BuildRobotsHandler())
	router.HandleFunc("/index.xml", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/posts.rss", http.StatusMovedPermanently)
	})
	router.HandleFunc("/index.rss", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/posts.rss", http.StatusMovedPermanently)
	})
	router.HandleFunc("/feed.rss", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/posts.rss", http.StatusMovedPermanently)
	})
	router.HandleFunc("/feed.xml", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/posts.rss", http.StatusMovedPermanently)
	})
	router.HandleFunc("/rss", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/posts.rss", http.StatusMovedPermanently)
	})

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
		"/fonts/{path:.*}",
		handlers.BuildFontHandler(),
	).Methods("GET")
	router.HandleFunc(
		"/static/{path:.*}",
		handlers.BuildStaticHandler(),
	).Methods("GET")

	router.HandleFunc("/acknowledgements", public.BuildAcknowledgementsHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/search", public.BuildSearchHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}.rss", public.BuildSectionRSSHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}", public.BuildSectionShowHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}/{pageSlug}", public.BuildPageShowHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}/{pageSlug}/qr.png", public.BuildPageQRHandler(w.db)).
		Methods("GET")
	router.HandleFunc("/{sectionSlug}/{pageSlug}/{attachmentFilename}", public.BuildPageAttachmentHandler(w.db, w.bucketName, w.googleJSON)).
		Methods("GET")
	router.HandleFunc("/", public.BuildIndexHandler(w.db)).
		Methods("GET")

	router.Use(middlewares.BuildGoAwayMiddleware())
	router.Use(middlewares.BuildRedirectMiddleware(w.db))
	router.Use(middlewares.BuildCountsMiddleware(w.db, w.adminPath))
	router.Use(gorillaHandlers.CompressHandler)
	router.NotFoundHandler = http.HandlerFunc(status.BuildNotFoundHandler(w.db))

	return nil
}
func (w *Website) HTTPHost() string {
	return w.host
}
func (w *Website) HTTPPath() string { return "" }

func (w *Website) ExternalJobsFuncSet(f func(job apis.ExternalJob) error) {}
