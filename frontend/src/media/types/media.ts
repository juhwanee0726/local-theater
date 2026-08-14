import type { MediaType } from "../api/media.api.response";

//
// ----- Media --------------------------------------------------
//
export interface MediaCard {
    id: string,
    type: MediaType,
    size: number,
    name?: string,
    src: string,
    createdAt: number,
    showDescription?: boolean
}

interface MediaBase extends MediaCard {
    width: number,
    height: number,
    thumbnailUrl: string,
    downloadUrl: string
}

export interface Video extends MediaBase {
    type: "video",
    duration: number,
    fps: number,

}

export interface Image extends MediaBase {
    type: "image",
    width: number,
    height: number,
    downloadUrl: string
}

export type Media = Video | Image;


//
// ----- Other --------------------------------------------------
//

export type MediaSortKey = "id" | "createdAt" | "size";
export type MediaSortOrder = "asc" | "desc";
export type MediaSortMode =
    | {
        type: "shuffle",
        seed: number
    }
    | {
        type: "sort"
        key: MediaSortKey,
        order: MediaSortOrder
    }

export type UploadProgress = {
    loaded: number,
    total: number,
    bytes?: number,
    rate?: number,
    estimated?: number
}

export type UploadItem = {
    file: File,
    progress: UploadProgress
}