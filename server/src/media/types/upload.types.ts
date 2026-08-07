import { MediaType } from "./media.types.js";

const VALID_VIDEO_MIMES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const VALID_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"]);

export const TYPE_MIME_MAP: Record<MediaType, Set<string>> = {
    "video": VALID_VIDEO_MIMES,
    "image": VALID_IMAGE_MIMES
}

export type UploadSessionStatus = "uploading" | "merging" | "success" | "failed";
export type UploadType = "single" | "chunk";

interface UploadSessionBase {
    id: string,
    status: UploadSessionStatus,
    uploadType: UploadType,
    mediaType: MediaType,
    hashAlgo: "SHA-256",
    fileName: string,
    fileSize: number,
    createdAt: number,
    updatedAt: number,
    expiresAt: number
}

export interface Chunk {
    index: number,
    hash: string
}

export interface SingleUploadSession extends UploadSessionBase {
    uploadType: "single"
}

export interface ChunkUploadSession extends UploadSessionBase {
    uploadType: "chunk",
    chunkSize: number,
    totalChunks: number,
    chunks: Chunk[]
}

export type UploadSession = SingleUploadSession | ChunkUploadSession;

export type UploadTmp = {
    session: UploadSession,
    hash: string,
    size: number,
    uploadPath: string
}

//
// ----- DB row --------------------------------------------------
//
export type UploadSessionRow = {
    id: string,
    status: UploadSessionStatus,
    upload_type: UploadType,
    media_type: MediaType
    hash_algo: "SHA-256",
    file_name: string,
    file_size: number,
    chunk_size?: number,
    total_chunks?: number,
    created_at: number,
    updated_at: number,
    expires_at: number
}

export type UploadChunkRow = {
    upload_id: string,
    chunk_index: number,
    hash: string
}