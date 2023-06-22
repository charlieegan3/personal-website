package types

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/Jeffail/gabs/v2"
	"gopkg.in/yaml.v3"
)

type Page struct {
	ID        int    `db:"id"`
	SectionID int    `db:"section_id"`
	Slug      string `db:"slug"`

	Title   string `db:"title"`
	Content string `db:"content"`

	IsDraft     bool `db:"is_draft"`
	IsProtected bool `db:"is_protected"`
	IsDeleted   bool `db:"is_deleted"`

	Data       []uint8 `db:"data"`
	parsedData interface{}

	PublishedAt time.Time `db:"published_at"`
	CreatedAt   time.Time `db:"created_at"`
}

func (p *Page) DataYAML() string {
	var data map[string]interface{}
	err := json.Unmarshal(p.Data, &data)
	if err != nil {
		return string(p.Data)
	}

	dataYAMLBytes, err := yaml.Marshal(data)
	if err != nil {
		return string(p.Data)
	}

	return string(dataYAMLBytes)
}

func (p *Page) GetDataValue(path string) (interface{}, error) {
	if p.parsedData == nil {
		err := yaml.Unmarshal(p.Data, &p.parsedData)
		if err != nil {
			return nil, err
		}
	}

	return gabs.Wrap(p.parsedData).Path(path).Data(), nil
}

func (p *Page) ExternalURL() string {
	u, err := p.GetDataValue("external_url")
	if err != nil {
		return ""
	}

	str := fmt.Sprintf("%v", u)
	if !strings.HasPrefix(str, "http") {
		return ""
	}

	return fmt.Sprintf("%v", u)
}

func (p *Page) OGImage() string {
	i, err := p.GetDataValue("ogimage")
	if err != nil || i == nil {
		return ""
	}

	return fmt.Sprintf("%v", i)
}
