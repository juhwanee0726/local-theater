import { MediaType } from "./media.types.js";
import { UploadSessionStatus, UploadType } from "./upload.types.js";

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

interface UploadSessionResponseBase {
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

export interface SingleUploadSessionResponse extends UploadSessionResponseBase {
    uploadType: "single"
}

export interface ChunkUploadSessionResponse extends UploadSessionResponseBase {
    uploadType: "chunk",
    chunkSize: number,
    totalChunks: number,
    receivedChunks: number[]
}

export type UploadSessionResponse = SingleUploadSessionResponse | ChunkUploadSessionResponse;