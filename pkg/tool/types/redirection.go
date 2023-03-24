package types

type Redirection struct {
	ID int `db:"id"`

	Source string `db:"source"`

	Destination       string `db:"destination"`
	DestinationPageID *int   `db:"destination_page_id"`
}
