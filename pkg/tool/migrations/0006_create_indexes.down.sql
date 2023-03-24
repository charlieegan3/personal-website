SET search_path TO personal_website;

drop index if exists sections_slug_idx;
drop index if exists pages_slug_idx;
drop index if exists pages_section_id_idx;
drop index if exists pages_is_deleted_idx;
drop index if exists pages_is_draft_idx;
drop index if exists pages_published_at_idx;
