import { Chunk, UploadChunkRow, UploadSession, UploadSessionRow } from "../types/upload.types.js";

export const toUploadSession = (sessionRow: UploadSessionRow, chunkRows: UploadChunkRow[]): UploadSession => {
    const base = {
        id: sessionRow.id,
        status: sessionRow.status,
        mediaType: sessionRow.media_type,
        hashAlgo: sessionRow.hash_algo,
        fileName: sessionRow.file_name,
        fileSize: sessionRow.file_size,
        createdAt: sessionRow.created_at,
        updatedAt: sessionRow.updated_at,
        expiresAt: sessionRow.expires_at
    }
    if (sessionRow.upload_type === "single") {
        return {
            ...base,
            uploadType: sessionRow.upload_type,
        }
    }
    if (!sessionRow.chunk_size || !sessionRow.total_chunks)
        throw new Error("Upload session fields has null");

    return {
        ...base,
        uploadType: sessionRow.upload_type,
        chunkSize: sessionRow.chunk_size,
        totalChunks: sessionRow.total_chunks,
        chunks: chunkRows.map(cr => ({
            index: cr.chunk_index,
            hash: cr.hash
        }))

    }
}

export const toUploadSessionRow = (session: UploadSession): UploadSessionRow => {
    const base = {
        id: session.id,
        status: session.status,
        media_type: session.mediaType,
        hash_algo: session.hashAlgo,
        file_name: session.fileName,
        file_size: session.fileSize,
        created_at: session.createdAt,
        updated_at: session.updatedAt,
        expires_at: session.expiresAt,

    }
    if (session.uploadType === "single") {
        return {
            ...base,
            upload_type: session.uploadType
        }
    }
    return {
        ...base,
        upload_type: session.uploadType,
        chunk_size: session.chunkSize,
        total_chunks: session.totalChunks
    }
}

export const toUploadChunkRow = (id: string, chunk: Chunk): UploadChunkRow => ({
    upload_id: id,
    chunk_index: chunk.index,
    hash: chunk.hash
})