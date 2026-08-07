export const mediaStmt = {
    existsById: `
SELECT 1
FROM media_file
WHERE id = ?
LIMIT 1;
`,
    findById: `
SELECT *
FROM media_file AS mf
LEFT JOIN media_metadata AS mm
ON mf.id = mm.media_id
WHERE id = ?;
`,
    findAll: `
SELECT *
FROM media_file AS mf
LEFT JOIN media_metadata AS mm
ON mf.id = mm.media_id
ORDER BY created_at DESC;
`,
    findAllByType: `
SELECT *
FROM media_file AS mf
LEFT JOIN media_metadata AS mm
ON mf.id = mm.media_id
WHERE type = ?
ORDER BY created_at DESC;
`,
    updateStatusById: `
UPDATE media_file
SET status = ?
WHERE id = ?;
`,
    deleteById: `
DELETE
FROM media_file
WHERE id = ?;
`,
    saveMedia: `
INSERT OR IGNORE INTO media_file (
    id,
    type,
    status,
    file_name,
    file_size,
    ext,
    mime,
    created_at,
    updated_at
) VALUES (
    $id,
    $type,
    $status,
    $file_name,
    $file_size,
    $ext,
    $mime,
    $created_at,
    $updated_at
);
`,
    saveMediaMeta: `
INSERT INTO media_metadata (
    media_id,
    width,
    height,
    duration,
    fps
)
VALUES (
    $media_id,
    $width,
    $height,
    $duration,
    $fps
);
`
}


export const uploadSessionStmt = {
    findSessionById: `
SELECT *
FROM upload_session
WHERE id = ?;
`,
    findChunksById: `
SELECT *
FROM upload_chunk
WHERE upload_id = ?;
`,
    findAllSessions: `
SELECT *
FROM upload_session
ORDER BY created_at DESC;
`,
    findSessionsByUploadType: `
SELECT *
FROM upload_session
WHERE upload_type = ?
ORDER BY created_at DESC;
`,
    updateStatusById: `
UPDATE upload_session
SET status = ?
WHERE id = ?;
`,
    deleteById: `
DELETE
FROM upload_session
WHERE id = ?;
`,
    saveUploadSession: `
INSERT INTO upload_session (
    id,
    status,
    upload_type,
    media_type,
    hash_algo,
    file_name,
    file_size,
    chunk_size,
    total_chunks,
    created_at,
    updated_at,
    expires_at
)
VALUES (
    $id,
    $status,
    $upload_type,
    $media_type,
    $hash_algo,
    $file_name,
    $file_size,
    $chunk_size,
    $total_chunks,
    $created_at,
    $updated_at,
    $expires_at
);
`,
    saveChunk: `
INSERT INTO upload_chunk (
    upload_id,
    chunk_index,
    hash
)
VALUES (
    $upload_id,
    $chunk_index,
    $hash
);
`
}