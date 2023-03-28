package utils

import (
	"fmt"
	"regexp"
	"strings"
)

var linkRegex = regexp.MustCompile(`(!\[[^\]]*]\()(\.\/)([^:\)]+)\)`)

func ExpandLinks(scheme, host, content, section, page string) string {
	if strings.HasPrefix(scheme, "https") {
		scheme = "https://"
	} else {
		scheme = "http://"
	}

	res := strings.Replace(linkRegex.ReplaceAllString(
		content,
		fmt.Sprintf(`$1@HOST/%s/%s/$3)`, section, page),
	), "@HOST", scheme+host, 1)
	return res
}
