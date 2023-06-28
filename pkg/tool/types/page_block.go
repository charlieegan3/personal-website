package types

type PageBlock struct {
	ID     int `db:"id" goqu:"skipinsert"`
	PageID int `db:"page_id"`
	Rank   int `db:"rank"`

	Col1 string `db:"col1"`
	Col2 string `db:"col2"`

	LeftImageName    string `db:"left_image_name"`
	LeftImageCaption string `db:"left_image_caption"`
	LeftImageAlt     string `db:"left_image_alt"`

	RightImageName    string `db:"right_image_name"`
	RightImageCaption string `db:"right_image_caption"`
	RightImageAlt     string `db:"right_image_alt"`

	IntroImageName    string `db:"intro_image_name"`
	IntroImageCaption string `db:"intro_image_caption"`
	IntroImageAlt     string `db:"intro_image_alt"`

	OutroImageName    string `db:"outro_image_name"`
	OutroImageCaption string `db:"outro_image_caption"`
	OutroImageAlt     string `db:"outro_image_alt"`
}
