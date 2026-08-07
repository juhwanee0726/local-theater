//
// ----- MediaResponse --------------------------------------------------
//
export type MediaType = "image" | "video";
export type MediaStatus = "ready" | "pending" | "failed";

interface Dimension {
    width: number,
    height: number
}

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

export interface VideoResponse extends MediaResponseBase, MediaUrl,  Dimension {
    type: "video",
    status: "ready",
    duration: number,
    fps: number,
    url: string,
    thumbnailUrl: string,
}

export interface ImageResponse extends MediaResponseBase, MediaUrl,  Dimension {
    type: "image",
    status: "ready",
    url: string,
    thumbnailUrl: string
}

export type ReadyMediaResponse = VideoResponse | ImageResponse;

export interface PendingMediaResponse extends MediaResponseBase {
    status: "pending"
}

export interface FailedMediaResponse extends MediaResponseBase {
    status: "failed"
}

export type MediaResponse = ReadyMediaResponse | PendingMediaResponse | FailedMediaResponse;

//
// ----- UploadResponse --------------------------------------------------
//
export type UploadSessionStatus = "uploading" | "success" | "error";
export type UploadType = "single" | "chunk";
export interface ChunksStat {
    chunkSize: number,
    totalChunks: number,
    receivedChunks: Set<number>
}

interface UploadSessionCreateResponseBase {
    uploadType: UploadType,
    sessionId: string,
    algorithm: string,
    url: string

}
interface ChunkSessionCreateResponse extends UploadSessionCreateResponseBase {
    uploadType: "chunk",
    chunkSize: number
}

interface SingleSessionCreateResponse extends UploadSessionCreateResponseBase {
    uploadType: "single",
}

export type UploadSessionCreateResponse = ChunkSessionCreateResponse | SingleSessionCreateResponse;

export interface UploadSessionResponse {
    id: string,
    status: UploadSessionStatus,
    uploadType: UploadType,
    mediaType: MediaType,
    hashAlgo: string,
    fileName: string,
    fileSize: number,
    chunksStat?: ChunksStat,
    createdAt: number,
    expiresAt: number
}