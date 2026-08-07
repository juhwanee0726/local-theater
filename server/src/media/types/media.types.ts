//
// ----- Media --------------------------------------------------
//
export type MediaType = "video" | "image";
export type MediaStatus = "ready" | "pending" | "failed"

export interface Dimension {
    width: number,
    height: number
}

export interface MediaBase {
    id: string,
    type: MediaType,
    status: MediaStatus,
    fileName: string,
    fileSize: number,
    ext: string,
    mime: string,
    createdAt: number,
    updatedAt: number
}

export interface Video extends MediaBase, Dimension {
    type: "video",
    status: "ready",
    duration: number,
    fps: number
}

export interface Image extends MediaBase, Dimension {
    type: "image",
    status: "ready",
}

export type ReadyMedia = Video | Image;

export interface PendingMedia extends MediaBase {
    status: "pending"
}

export interface FailedMedia extends MediaBase {
    status: "failed"
}

export type Media = Video | Image | PendingMedia | FailedMedia;

//
// ----- DB Row --------------------------------------------------
//

type Nullable<T> = { [K in keyof T]: T[K] | null; }

export type MediaFileRow = {
    id: string,
    type: MediaType,
    status: MediaStatus,
    file_name: string,
    file_size: number,
    ext: string,
    mime: string,
    created_at: number,
    updated_at: number
}

export type MediaMetadataRow = {
    media_id: string,
    width: number,
    height: number,
    duration: number | null,
    fps: number | null
}

export type MediaRow = MediaFileRow & Nullable<Omit<MediaMetadataRow, "media_id">>
