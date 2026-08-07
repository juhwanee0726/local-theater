import { Dimension, MediaStatus, MediaType } from "./media.types.js"

interface MediaResponseBase {
    id: string,
    type: MediaType,
    status: MediaStatus
    fileName: string,
    fileSize: number,
    ext: string,
    mime: string,
    createdAt: number,
    updatedAt: number
}

interface MediaUrl {
    url: string,
    thumbnailUrl: string,
    downloadUrl: string,
}

export interface VideoResponse extends MediaResponseBase, MediaUrl, Dimension {
    type: "video",
    status: "ready",
    duration: number,
    fps: number,
}

export interface ImageResponse extends MediaResponseBase, MediaUrl, Dimension {
    type: "image",
    status: "ready",
}

export type ReadyMediaResponse = VideoResponse | ImageResponse

export interface PendingMediaResponse extends MediaResponseBase {
    status: "pending"
}

export interface FailedMediaResponse extends MediaResponseBase {
    status: "failed"
}

export type MediaResponse = ReadyMediaResponse | PendingMediaResponse | FailedMediaResponse;
