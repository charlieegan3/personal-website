SET search_path TO personal_website;

create table redirections
(
    id   serial PRIMARY KEY,
    source text not null,

    destination_page_id integer references pages(id) on delete cascade,
    destination text not null,

    unique (source)
);
