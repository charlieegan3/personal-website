package mutate

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
	"github.com/charlieegan3/personal-website/pkg/tool/utils"
)

func ImageEtag(content string, attachments []types.PageAttachment) string {

	re := regexp.MustCompile(`(!\[[^\]*]*\])\((\.\/)?([^\)\?]+)(\?.*)?\)`)

	matches := re.FindAllStringSubmatch(content, -1)

	for _, match := range matches {
		if len(match) != 5 {
			continue
		}

		alt := match[1]
		filename := match[3]

		for _, attachment := range attachments {
			if attachment.Filename != filename {
				continue
			}

			content = strings.Replace(
				content,
				match[0],
				fmt.Sprintf("%s(%s?etag=%s)", alt, filename, utils.CRC32Hash([]byte(attachment.Etag))),
				1,
			)

			break
		}

		fmt.Println("---")
	}

	return content
}
