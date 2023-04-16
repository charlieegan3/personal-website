package utils

import (
	"fmt"
	"log"
	"regexp"
	"strings"
	"text/template"
)

var linkRegex = regexp.MustCompile(`(!\[[^\]]*\]\()(\.\/)?([^:\)]+)\)`)

func ExpandImageSrcs(host, content, section, page string) string {
	var scheme string
	if strings.Contains(host, "localhost") {
		scheme = "http://"
	} else {
		scheme = "https://"
	}

	res := strings.ReplaceAll(linkRegex.ReplaceAllString(
		content,
		fmt.Sprintf(`$1@HOST/%s/%s/$3)`, section, page),
	), "@HOST", scheme+host)
	return res
}

func TemplateMD(content string, path string) string {
	tmpl, err := template.New("page.md").Funcs(
		template.FuncMap{
			"attachment_link": func(text, filename string) string {
				return fmt.Sprintf(`<a href="%s/%s" target="_blank">%s</a>`, strings.TrimSuffix(path, "/"), filename, text)
			},
		},
	).Parse(content)
	if err != nil {
		log.Println("Error parsing template:", err)
		return content
	}

	var buf strings.Builder
	err = tmpl.Execute(&buf, nil)
	if err != nil {
		log.Println("Error executing template:", err)
		return content
	}

	return buf.String()
}
