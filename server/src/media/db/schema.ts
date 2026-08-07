const mediaSchema = {
    media: `
CREATE TABLE IF NOT EXISTS media_file (
    id              TEXT PRIMARY KEY,
    type            TEXT NOT NULL,
    status          TEXT NOT NULL,
    file_name       TEXT NOT NULL,
    file_size       INTEGER NOT NULL,
    ext             TEXT NOT NULL,
    mime            TEXT NOT NULL,

    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL
) WITHOUT ROWID;
`,
    mediaMetadata: `
CREATE TABLE IF NOT EXISTS media_metadata (
    media_id    TEXT PRIMARY KEY,
    width       INTEGER NOT NULL,
    height      INTEGER NOT NULL,
    duration REAL,
    fps         REAL,

    FOREIGN KEY (media_id)
        REFERENCES media_file(id)
        ON DELETE CASCADE
) WITHOUT ROWID;
`,
    index: `
CREATE INDEX IF NOT EXISTS idx_type ON media_file(type);
`
}

const uploadSchema = {
    session: `
CREATE TABLE IF NOT EXISTS upload_session (
    id              TEXT PRIMARY KEY,
    status          TEXT NOT NULL,
    upload_type     TEXT NOT NULL,
    media_type      TEXT NOT NULL,
    hash_algo       TEXT NOT NULL,
    file_name       TEXT NOT NULL,
    file_size       INTEGER NOT NULL,
    chunk_size      INTEGER,
    total_chunks    INTEGER,
    created_at      INTEGER NOT NULL,
    updated_at      INTEGER NOT NULL,
    expires_at      INTEGER NOT NULL
);
`,
    chunk: `
CREATE TABLE IF NOT EXISTS upload_chunk (
    upload_id   TEXT,
    chunk_index INTEGER,
    hash        TEXT NOT NULL,

    PRIMARY KEY (upload_id, chunk_index),
    FOREIGN KEY (upload_id)
        REFERENCES upload_session(id)
        ON DELETE CASCADE
);
`
}

const schema = [
    ...Object.values(mediaSchema),
    ...Object.values(uploadSchema)
].join("");

export default schema;