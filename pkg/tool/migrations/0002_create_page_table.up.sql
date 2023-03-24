SET search_path TO personal_website, public;

create table sections
(
    id   serial PRIMARY KEY,
    slug text not null,
    name text not null,

    unique (slug)
);

insert into sections (slug, name)
values ('posts', 'Blog'),
       ('weeknotes', 'Weeknotes'),
       ('unlisted', 'Unlisted'),
       ('talks', 'Talks');

CREATE TABLE pages
(
    id           serial PRIMARY KEY,
    section_id   integer REFERENCES sections (id) DEFAULT null,

    slug         text UNIQUE NOT NULL             DEFAULT '',
    title        text        NOT NULL,
    content      text        NOT NULL,

    is_draft     BOOLEAN     NOT NULL             DEFAULT false,
    is_protected BOOLEAN     NOT NULL             DEFAULT false,
    is_deleted   BOOLEAN     NOT NULL             DEFAULT FALSE,

    data         jsonb       NOT NULL             DEFAULT '{}',

    published_at timestamp   NOT NULL             DEFAULT now(),
    created_at   timestamp   NOT NULL             DEFAULT now()
);

CREATE TABLE page_images
(
    id         serial PRIMARY KEY,
    page_id    integer REFERENCES pages (id) NOT NULL,

    source     text                          NOT NULL,
    format     text                          NOT NULL,

    created_at timestamp                     NOT NULL DEFAULT now()
);
