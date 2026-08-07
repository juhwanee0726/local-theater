import { CHUNK_SIZE, MAX_SINGLE_SIZE, SESSION_EXPIRES_MILL } from "#/config/config.js";
import { HttpError } from "#/error/error.js";
import crypto from "node:crypto";
import { UploadSessionCreateRequest } from "../types/upload.request.js";
import { UploadSessionCreateResponse, UploadSessionResponse } from "../types/upload.response.js";
import { ChunkUploadSession, SingleUploadSession, UploadSession, UploadSessionStatus, UploadType } from "../types/upload.types.js";
import uploadSessionRepository from "./upload-session.repository.js";

const toResponse = (session: UploadSession): UploadSessionResponse => {
    const base = {
        id: session.id,
        status: session.status,
        mediaType: session.mediaType,
        hashAlgo: session.hashAlgo,
        fileName: session.fileName,
        fileSize: session.fileSize,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        expiresAt: session.expiresAt
    }
    if (session.uploadType === "single") {
        return {
            ...base,
            uploadType: session.uploadType
        }
    }
    return {
        ...base,
        uploadType: session.uploadType,
        chunkSize: session.chunkSize,
        totalChunks: session.totalChunks,
        receivedChunks: session.chunks.map(v => v.index)
    }
}

const uploadSessionService = {
    createUploadSession: ({ fileName, fileSize, type }: UploadSessionCreateRequest): UploadSessionCreateResponse => {
        const id = crypto.randomUUID();
        const now = Date.now();

        const base = {
            id,
            status: "uploading",
            mediaType: type,
            hashAlgo: "SHA-256",
            fileName: fileName,
            fileSize: fileSize,
            createdAt: now,
            updatedAt: now,
            expiresAt: now + SESSION_EXPIRES_MILL
        } as const;

        if (fileSize < MAX_SINGLE_SIZE) {
            const session: SingleUploadSession = {
                ...base,
                uploadType: "single"
            }

            uploadSessionRepository.save(session);
            return {
                sessionId: id,
                uploadType: session.uploadType,
                algorithm: "SHA-256",
                url: `/api/media/uploads/${id}/file`
            }
        }
        const chunk: ChunkUploadSession = {
            ...base,
            uploadType: "chunk",
            chunkSize: CHUNK_SIZE,
            totalChunks: Math.ceil(fileSize / CHUNK_SIZE),
            chunks: []
        }
        uploadSessionRepository.save(chunk);
        return {
            sessionId: id,
            uploadType: chunk.uploadType,
            chunkSize: CHUNK_SIZE,
            algorithm: "SHA-256",
            url: `/api/media/uploads/${id}/chunks/{index}`
        }
    },
    getUploadSessions: (uploadType?: UploadType) => uploadSessionRepository.findAll(uploadType),
    getUploadSession: (id: string): UploadSessionResponse => {
        const session = uploadSessionRepository.findById(id);
        if (!session) throw new HttpError(404, "Session not found");
        return toResponse(session);
    },
    updateSessionStatus: (id: string, status: UploadSessionStatus) => uploadSessionRepository.updateStatus(id, status),
    deleteUploadSession: (id: string) => uploadSessionRepository.deleteById(id)

}

export default uploadSessionService;