package utils

import (
	"fmt"
	"regexp"
	"strings"
)

var linkRegex = regexp.MustCompile(`(!\[[^\]]*\]\()(\.\/)([^:\)]+)\)`)

func ExpandLinks(scheme, host, content, section, page string) string {
	if strings.HasPrefix(scheme, "https") {
		scheme = "https://"
	} else {
		scheme = "http://"
	}

	res := strings.ReplaceAll(linkRegex.ReplaceAllString(
		content,
		fmt.Sprintf(`$1@HOST/%s/%s/$3)`, section, page),
	), "@HOST", scheme+host)
	return res
}
