import { Media, MediaBase, MediaFileRow, MediaMetadataRow, MediaRow, ReadyMedia } from "./types/media.types.js";

export const toMedia = (row: MediaRow): Media => {
    const base = {
        id: row.id,
        fileName: row.file_name,
        fileSize: row.file_size,
        ext: row.ext,
        mime: row.mime,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }

    if (row.status !== "ready") {
        return {
            ...base,
            type: row.type,
            status: row.status
        }
    }

    if (row.width == null || row.height === null)
        throw new Error("Media has no metadata");

    if (row.type === "video") {
        if (row.duration === null || row.fps === null)
            throw new Error("Video has no metadata");

        return {
            ...base,
            type: "video",
            status: row.status,
            width: row.width,
            height: row.height,
            duration: row.duration,
            fps: row.fps
        }
    }
    return {
        ...base,
        type: "image",
        status: row.status,
        width: row.width,
        height: row.height
    }
}

export const toMediaFileRow = (media: MediaBase): MediaFileRow => ({
    id: media.id,
    type: media.type,
    status: media.status,
    file_name: media.fileName,
    file_size: media.fileSize,
    ext: media.ext,
    mime: media.mime,
    created_at: media.createdAt,
    updated_at: media.updatedAt
})

export const toMediaDetailRow = (media: ReadyMedia): MediaMetadataRow => ({
    media_id: media.id,
    width: media.width,
    height: media.height,
    duration: (media.type === "video") ? media.duration : null,
    fps: (media.type === "video") ? media.fps : null,
})