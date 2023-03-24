package types

type Section struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
	Slug string `db:"slug"`
}
