SET search_path TO personal_website;

create table counts
(
    id serial PRIMARY KEY,
    bucket text not null default 'all',
    key text not null,
    count numeric default 0 not null,

    unique (bucket, key)
);
