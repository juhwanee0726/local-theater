import { TMP_DIR } from "#/config/config.js";
import { HttpError } from "#/error/error.js";
import storageService from "#/storage/storage.service.js";
import logger from "#/util/logger.js";
import { Request } from "express";
import fsp from "fs/promises";
import path from "path";
import mediaService from "../media.service.js";
import { UploadTmp } from "../types/upload.types.js";
import uploadSessionRepository from "./upload-session.repository.js";

const singleUploadSevice = {
    upload: async (file: Request, sessionId: string, oriHash: string): Promise<UploadTmp> => {
        const session = uploadSessionRepository.findById(sessionId);
        if (!session) throw new HttpError(404, "Session not found");

        const uploadPath = path.join(TMP_DIR, `${sessionId}.tmp`);
        try {
            const { hash, size } = await storageService.writeFile(file, uploadPath);

            if (hash !== oriHash) {
                throw new HttpError(409, "File hash mismatch", {
                    expect: oriHash,
                    actual: hash
                });
            }
            if (mediaService.existsMedia(hash)) {
                uploadSessionRepository.deleteById(sessionId);
                await fsp.unlink(uploadPath);
                throw new HttpError(409, "File already exists");
            }

            return {
                hash, size,
                session,
                uploadPath
            }
        } catch (err) {
            uploadSessionRepository.updateStatus(session.id, "failed");
            await fsp.unlink(uploadPath)
                .then(() => logger.info(`Unlinked ${uploadPath}`))
                .catch(e => logger.warn(`Failed to unlink ${e.message}`));
            throw err;
        }
    }
}

export default singleUploadSevice;