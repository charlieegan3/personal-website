package types

type PageAttachment struct {
	ID          int    `db:"id"`
	PageID      int    `db:"page_id"`
	Filename    string `db:"filename"`
	ContentType string `db:"content_type"`
}
