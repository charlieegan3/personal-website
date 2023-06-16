package mutate

import (
	"testing"

	"github.com/charlieegan3/personal-website/pkg/tool/types"
)

func TestImageEtag(t *testing.T) {

	content := `
![image](./image.jpg)

![something else](thing-with_random_NAME.thing.gif)

![image already tagged but wrong](ani.gif?etag=123)
`
	expectedContent := `
![image](image.jpg?etag=891568578)

![something else](thing-with_random_NAME.thing.gif?etag=214229345)

![image already tagged but wrong](ani.gif?etag=748695734)
`

	attachments := []types.PageAttachment{
		{
			Filename: "image.jpg",
			Etag:     "abc",
		},
		{
			Filename: "thing-with_random_NAME.thing.gif",
			Etag:     "def",
		},
		{
			Filename: "ani.gif",
			Etag:     "ghi/123",
		},
	}

	actualContent := ImageEtag(content, attachments)

	if actualContent != expectedContent {
		t.Errorf("expected %s, got %s", expectedContent, actualContent)
	}
}
