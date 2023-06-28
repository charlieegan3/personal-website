SET search_path TO personal_website, public;

CREATE TABLE page_blocks
(
    id serial PRIMARY KEY,
    page_id integer REFERENCES pages(id) NOT NULL,

    rank integer NOT NULL DEFAULT 0,

    col1 text NOT NULL DEFAULT '',
    col2 text NOT NULL DEFAULT '',

    left_image_name text NOT NULL DEFAULT '',
    left_image_caption text NOT NULL DEFAULT '',
    left_image_alt text NOT NULL DEFAULT '',

    right_image_name text NOT NULL DEFAULT '',
    right_image_caption text NOT NULL DEFAULT '',
    right_image_alt text NOT NULL DEFAULT '',

    intro_image_name text NOT NULL DEFAULT '',
    intro_image_caption text NOT NULL DEFAULT '',
    intro_image_alt text NOT NULL DEFAULT '',

    outro_image_name text NOT NULL DEFAULT '',
    outro_image_caption text NOT NULL DEFAULT '',
    outro_image_alt text NOT NULL DEFAULT ''
);

CREATE INDEX page_blocks_page_id_idx ON page_blocks(page_id);
