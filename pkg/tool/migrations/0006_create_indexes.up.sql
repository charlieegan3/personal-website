SET search_path TO personal_website;

CREATE INDEX IF NOT EXISTS sections_slug_idx ON sections (slug);
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages (slug);
CREATE INDEX IF NOT EXISTS pages_section_id_idx ON pages (section_id);
CREATE INDEX IF NOT EXISTS pages_is_deleted_idx ON pages (is_deleted);
CREATE INDEX IF NOT EXISTS pages_is_draft_idx ON pages (is_draft);
CREATE INDEX IF NOT EXISTS pages_published_at_idx ON pages (published_at);
