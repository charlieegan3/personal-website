SET search_path TO personal_website, public;

CREATE TABLE page_attachments (
    id serial PRIMARY KEY,
    page_id integer NOT NULL REFERENCES pages(id),
    filename text NOT NULL,
    content_type text NOT NULL
);
