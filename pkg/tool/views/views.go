package views

import (
	"bytes"
	"crypto/md5"
	"embed"
	"fmt"
	"html/template"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/PuerkitoBio/goquery"
	chromaHTML "github.com/alecthomas/chroma/v2/formatters/html"
	"github.com/foolin/goview"
	fences "github.com/stefanfritsch/goldmark-fences"
	"github.com/yuin/goldmark"
	highlighting "github.com/yuin/goldmark-highlighting/v2"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"github.com/yuin/goldmark/text"
	"github.com/yuin/goldmark/util"
	"go.abhg.dev/goldmark/anchor"

	"github.com/charlieegan3/personal-website/pkg/tool/handlers"
	"github.com/charlieegan3/personal-website/pkg/tool/utils"
)

//go:embed templates/*
var views embed.FS

var Engine *goview.ViewEngine
var RSSEngine *goview.ViewEngine

// paragraphIdTransformer is a goldmark transformer that adds an id attribute to
// each paragraph, based on the content of the paragraph.
type paragraphIdTransformer struct{}

func (p *paragraphIdTransformer) Transform(node *ast.Paragraph, reader text.Reader, pc parser.Context) {
	node.SetAttribute(
		[]byte("id"),
		[]byte(fmt.Sprintf("p-%x", md5.Sum(reader.Source())))[:10],
	)
}

var MDFunc func(s string) template.HTML

func init() {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.Footnote,
			extension.Strikethrough,
			extension.Table,
			highlighting.NewHighlighting(
				highlighting.WithFormatOptions(
					chromaHTML.WithClasses(true),
					chromaHTML.WrapLongLines(true),
					chromaHTML.TabWidth(2),
				),
			),
			&anchor.Extender{
				Texter: anchor.Text("#"),
			},
			&fences.Extender{},
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
			parser.WithParagraphTransformers(util.Prioritized(&paragraphIdTransformer{}, 100)),
		),
		goldmark.WithRendererOptions(
			html.WithUnsafe(), // allows pre-templating of MD
			html.WithXHTML(),
		),
	)

	MDFunc = func(s string) template.HTML {
		var buf bytes.Buffer
		if err := md.Convert([]byte(s), &buf); err != nil {
			return template.HTML(
				fmt.Sprintf("Error converting markdown: %s", err),
			)
		}

		return template.HTML(buf.String())
	}

	var re = regexp.MustCompile(`(?mU)<p [^>]+>(.*)<\/p>`)
	inlineMDFunc := func(s string) template.HTML {
		var buf bytes.Buffer
		if err := md.Convert([]byte(strings.TrimSpace(s)), &buf); err != nil {
			return template.HTML(
				fmt.Sprintf("Error converting markdown: %s", err),
			)
		}
		return template.HTML(re.ReplaceAllString(buf.String(), "$1"))
	}

	cnfg := goview.Config{
		Root:      "templates",
		Extension: ".html",
		Master:    "layouts/master",
		Funcs: template.FuncMap{
			"markdown":          MDFunc,
			"markdown_inline":   inlineMDFunc,
			"template_markdown": utils.TemplateMD,
			"hash":              utils.CRC32Hash,
			"has_prefix":        strings.HasPrefix,
			"blurb": func(s string, count int) template.HTML {
				lines := strings.Split(s, "\n")
				if len(lines) > 5 {
					lines = lines[:5]
				}
				s = strings.Join(lines, "\n")

				raw := string(MDFunc(s))

				doc, err := goquery.NewDocumentFromReader(strings.NewReader(raw))
				if err != nil {
					return template.HTML("Error parsing HTML: " + err.Error())
				}

				text := ""
				doc.Find("p, li").Each(func(i int, s *goquery.Selection) {
					text += s.Text() + " "
				})

				words := strings.Split(text, " ")
				trailer := ""
				if len(words) > count {
					words = words[:count]
					trailer = "..."
				}
				return template.HTML(strings.TrimSpace(strings.Join(words, " ") + trailer))
			},
			"highlight": func(raw interface{}, reRaw string) template.HTML {

				s := fmt.Sprintf("%v", raw)

				var regexps []*regexp.Regexp

				re, err := regexp.Compile("(?i)" + reRaw)
				if err == nil {
					regexps = append(regexps, re)
				}

				for _, r := range regexps {
					s = r.ReplaceAllString(s, "<span class=\"highlight\">$0</span>")
				}

				return template.HTML(s)
			},
			"stylesETag": func() template.HTML {
				return template.HTML(handlers.StylesETag)
			},
			"scriptETag": func() template.HTML {
				return template.HTML(handlers.ScriptEtag)
			},
		},
	}

	Engine = goview.New(cnfg)
	Engine.SetFileHandler(func(config goview.Config, tmpl string) (string, error) {
		path := filepath.Join(config.Root, tmpl)
		bs, err := views.ReadFile(path + config.Extension)
		return string(bs), err
	})

	rssCnfg := cnfg
	rssCnfg.Master = "layouts/rss"

	RSSEngine = goview.New(rssCnfg)
	RSSEngine.SetFileHandler(func(config goview.Config, tmpl string) (string, error) {
		path := filepath.Join(config.Root, tmpl)
		bs, err := views.ReadFile(path + config.Extension)
		return string(bs), err
	})
}
