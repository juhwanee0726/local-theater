import type { MediaType } from "./media.api.response";

export type UploadSessionCreateRequest = {
    type: MediaType,
    fileName: string,
    fileSize: number
};

export type UploadSessionPartRequest = {
    index: number,
    hash: string,
    blob: Blob
}