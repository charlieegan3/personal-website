SET search_path TO personal_website;

ALTER TABLE page_attachments
    ADD COLUMN IF NOT EXISTS etag text DEFAULT '' NOT NULL;
