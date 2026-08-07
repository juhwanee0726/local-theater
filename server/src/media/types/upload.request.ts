import { MediaType } from "./media.types.js"

export type UploadSessionCreateRequest = {
    type: MediaType,
    fileName: string,
    fileSize: number
}