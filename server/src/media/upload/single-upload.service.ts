import { TMP_DIR } from "#/config/config.js";
import { HttpError } from "#/error/error.js";
import storageService from "#/storage/storage.service.js";
import logger from "#/util/logger.js";
import busboy from "busboy";
import { Request } from "express";
import fsp from "fs/promises";
import path from "path";
import mediaService from "../media.service.js";
import { UploadTmp } from "../types/upload.types.js";
import uploadSessionRepository from "./upload-session.repository.js";

const singleUploadSevice = {
    upload: async (req: Request, sessionId: string, oriHash: string): Promise<UploadTmp> => {
        const bb = busboy({ headers: req.headers });
        const session = uploadSessionRepository.findById(sessionId);
        if (!session) throw new HttpError(404, "Session not found");

        const uploadPath = path.join(TMP_DIR, `${sessionId}.tmp`);

        try {
            const { size, hash } = await new Promise<{ size: number, hash: string }>((resolve, reject) => {
                let fileReceived = false;
                bb.on("error", reject);
                bb.on("file", (_, file, __) => {
                    fileReceived = true;
                    storageService.writeFile(file, uploadPath)
                        .then(resolve)
                        .catch(reject)
                });
                bb.on("close", () => {
                    if (!fileReceived) reject(new HttpError(400, "No file field in request"));
                });
                req.on("error", reject);
                req.pipe(bb);
            });

            if (hash !== oriHash) {
                throw new HttpError(409, "File hash mismatch", {
                    expect: oriHash,
                    actual: hash
                });
            }
            if (mediaService.existsMedia(hash)) {
                throw new HttpError(409, "File already exists");
            }

            logger.info(`Uploaded file in session: ${session.id}`);
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