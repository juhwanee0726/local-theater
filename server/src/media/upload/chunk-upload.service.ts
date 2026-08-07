import { CHUNKS_DIR, TMP_DIR } from "#/config/config.js";
import { HttpError } from "#/error/error.js";
import storageService from "#/storage/storage.service.js";
import logger from "#/util/logger.js";
import { Request } from "express";
import fsp from "fs/promises";
import path from "path";
import mediaRepository from "../media.repository.js";
import { UploadTmp } from "../types/upload.types.js";
import uploadSessionRepository from "./upload-session.repository.js";

const chunkUploadService = {
    uploadPart: async (file: Request, sessionId: string, index: number, oriHash: string) => {
        const session = uploadSessionRepository.findById(sessionId);
        if (!session) throw new HttpError(404, "Session not found");
        if (session.uploadType !== "chunk") throw new HttpError(400, "Invalid Upload type");

        if (!Number.isInteger(index) || index < 0 || index >= Number(session.totalChunks))
            throw new HttpError(400, `Invalid index: ${index}`);

        const received = new Set(session.chunks.map(c => c.index));

        if (received.has(index)) {
            logger.info(`"${index}" Chunk alreay uploaded`);
            return;
        }

        const pad = String(session.totalChunks - 1).length;
        const chunkName = `${sessionId}-${String(index).padStart(pad, "0")}.part`;
        const chunkPath = path.join(CHUNKS_DIR, sessionId, chunkName);

        const { hash } = await storageService.writeFile(file, chunkPath);
        if (hash !== oriHash) {
            await fsp.unlink(chunkPath)
                .then(() => logger.info(`Unlinked ${chunkPath}`))
                .catch(e => logger.warn(`Failed to unlink: ${e.message}`));
            throw new HttpError(409, "File hash mismatch", {
                except: oriHash,
                actual: hash
            });
        }

        uploadSessionRepository.saveChunk(sessionId, { hash, index });
        logger.info(`Uploaded ${chunkName}`);
    },
    merge: async (sessionId: string): Promise<UploadTmp> => {
        const session = uploadSessionRepository.findById(sessionId);
        if (!session) throw new HttpError(404, "Session not found");
        if (session.uploadType !== "chunk") throw new HttpError(400, "Invalid Upload type");

        const allIdxs = Array.from({ length: session.totalChunks }, (_, i) => i);
        const received = new Set(session.chunks.map(c => c.index));
        const required = allIdxs.filter(v => !received.has(v));

        if (required.length > 0)
            throw new HttpError(400, `Required ${required} idx`);

        const chunksDir = path.join(CHUNKS_DIR, sessionId);
        const uploadPath = path.join(TMP_DIR, sessionId);

        const { hash, size } = await storageService.mergeChunks(chunksDir, uploadPath);
        if (mediaRepository.existsById(hash)) {
            await fsp.rm(chunksDir, { recursive: true, force: true })
                .then(() => logger.info(`Removed ${chunksDir}`))
                .catch(e => logger.warn(`Failed to rm ${e.message}`));
            await fsp.unlink(uploadPath)
                .then(() => logger.info(`Unlinked ${uploadPath}`))
                .catch(e => logger.warn(`Failed to unlink ${e.message}`));
            uploadSessionRepository.deleteById(sessionId);
            throw new HttpError(409, "File already exists");
        }

        return {
            hash, size,
            session,
            uploadPath
        }
    },
}
export default chunkUploadService;