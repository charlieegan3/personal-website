package utils

import (
	"fmt"
	"regexp"
	"strings"
)

var linkRegex = regexp.MustCompile(`(!\[[^\]]*\]\()(\.\/)([^:\)]+)\)`)

func ExpandLinks(host, content, section, page string) string {
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
