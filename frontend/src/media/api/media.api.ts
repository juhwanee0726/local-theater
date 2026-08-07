import type { UploadProgress } from "../types/media";
import client from "./media.api.client";
import type { UploadSessionCreateRequest, UploadSessionPartRequest } from "./media.api.request";
import type { MediaResponse, MediaType, UploadSessionCreateResponse, UploadSessionResponse } from "./media.api.response";

export const uploadApi = {
    /** GET "/api/uploads" */
    getUploadSessions: (): Promise<UploadSessionResponse[]> => {
        return client.get("/api/uploads")
    },
    /** POST "/api/uploads" */
    createUploadSession: (data: UploadSessionCreateRequest): Promise<UploadSessionCreateResponse> => {
        return client.post("/api/uploads", data)
    },
    /** GET "/api/uploads/:sessionId" */
    getUploadSession: (sessionId: string): Promise<UploadSessionResponse> => {
        return client.get(`/api/uploads/${sessionId}`);
    },
    /** PUT "/api/uploads/:sessionId/file" */
    uploadSingle: (sessionId: string, file: File, oriHash: string, onUploadProgress?: (p: UploadProgress) => void): Promise<void> => {
        return client.put(`/api/uploads/${sessionId}/file`, file, {
            headers: { "x-file-hash": oriHash },
            onUploadProgress: ({ loaded, bytes, estimated, rate }) => onUploadProgress?.({ loaded, bytes, estimated, rate, total: 0 })
        })
    },
    /** PUT "/api/uploads/:sessionId/chunks/:index" */
    uploadPart: (sessionId: string, data: UploadSessionPartRequest, onUploadProgress?: (p: UploadProgress) => void): Promise<void> => {
        return client.put(`/api/uploads/${sessionId}/chunks/${data.index}`, data.blob, {
            headers: { "x-chunk-hash": data.hash },
            onUploadProgress: ({ loaded, bytes }) => onUploadProgress?.({ loaded, bytes, total: 0 })
        })
    },
    /** POST "/api/uploads/:sessionId/chunks/merge" */
    merge: (sessionId: string): Promise<void> => {
        return client.post(`/api/uploads/${sessionId}/chunks/merge`)
    }
}


export const mediaApi = {
    /** GET /api/media */
    list: (type: MediaType): Promise<MediaResponse[]> => {
        return client.get(`/api/media?type=${type}`)
    },
    /** GET /api/media/:id */
    get: (id: string): Promise<MediaResponse> => {
        return client.get(`/api/media/${id}`)
    },
    /** DELETE /api/media/:id */
    delete: (id: string): Promise<void> => {
        return client.delete(`/api/media/${id}`)
    },
    /** POST /api/media/:id/thumbnail */
    createThumbnail: (id: string, offset: number): Promise<void> => {
        return client.post(`/api/media/${id}/thumbnail`, {offset});
    }
}