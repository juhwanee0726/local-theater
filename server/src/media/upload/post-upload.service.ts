import { CHUNKS_DIR, generateMediaPath, MEDIA_DIR, THUMB_EXT } from "#/config/config.js";
import { HttpError } from "#/error/error.js";
import storageService from "#/storage/storage.service.js";
import ffmpegUtils from "#/util/ffmpegUtils.js";
import logger from "#/util/logger.js";
import { fileTypeFromFile } from "file-type";
import { imageSizeFromFile } from "image-size/fromFile";
import fsp from "node:fs/promises";
import path from "path";
import mediaRepository from "../media.repository.js";
import mediaService from "../media.service.js";
import { Image, PendingMedia, Video } from "../types/media.types.js";
import { TYPE_MIME_MAP, UploadTmp } from "../types/upload.types.js";
import uploadSessionRepository from "./upload-session.repository.js";

const createPendingMedia = async (tmp: UploadTmp) => {
    const fileType = await fileTypeFromFile(tmp.uploadPath);
    if (!fileType || !TYPE_MIME_MAP[tmp.session.mediaType].has(fileType.mime))
        throw new HttpError(400, `Unsupported mime type: ${fileType?.mime}`);

    const mediaPath = path.join(MEDIA_DIR, generateMediaPath(tmp.hash, fileType.ext));
    try {
        await storageService.moveFile(tmp.uploadPath, mediaPath);

        if (tmp.session.uploadType === "chunk") {
            const chunksDir = path.join(CHUNKS_DIR, tmp.session.id);
            await fsp.rm(chunksDir, { recursive: true, force: true });
        }

        const now = Date.now();
        const pendingMedia: PendingMedia = {
            id: tmp.hash,
            type: tmp.session.mediaType,
            status: "pending",
            fileName: tmp.session.fileName,
            fileSize: tmp.size,
            ext: fileType.ext,
            mime: fileType.mime,
            createdAt: now,
            updatedAt: now
        }

        mediaService.saveMediaFile(pendingMedia);
        uploadSessionRepository.updateStatus(tmp.session.id, "success");
        return pendingMedia;
    } catch (err) {
        uploadSessionRepository.updateStatus(tmp.session.id, "failed");
        await fsp.unlink(mediaPath)
            .then(() => logger.info(`Unlinked ${mediaPath}`))
            .catch(e => logger.warn(`Failed to unlink ${e.message}`));
        throw err;
    }
}

const processMedia = async (pendingMedia: PendingMedia) => {
    try {
        const media = pendingMedia.type === "image"
            ? await createImage(pendingMedia)
            : await createVideo(pendingMedia)
        mediaService.completeMedia(media);
        logger.info(`${pendingMedia.id} is ready`);
    } catch (err) {
        logger.error(err);
        mediaRepository.updateStatus(pendingMedia.id, "failed");
    }
}


const createImage = async (pendingMedia: PendingMedia): Promise<Image> => {
    const imagePath = path.join(MEDIA_DIR, generateMediaPath(pendingMedia.id, pendingMedia.ext));
    try {
        const { width, height } = await imageSizeFromFile(imagePath);
        return {
            ...pendingMedia,
            status: "ready",
            type: "image",
            width, height
        }

    } catch (err) {
        await fsp.unlink(imagePath)
            .then(() => logger.info(`Unlinked ${imagePath}`))
            .catch(e => logger.warn(`Failed to unlink ${e.message}`));
        throw err;
    }
}

const createVideo = async (pendingMedia: PendingMedia): Promise<Video> => {
    const videoPath = path.join(MEDIA_DIR, generateMediaPath(pendingMedia.id, pendingMedia.ext));
    const thumbPath = path.join(MEDIA_DIR, generateMediaPath(pendingMedia.id, THUMB_EXT));
    try {
        const entries = await ffmpegUtils.extractVideoEntries(videoPath);
        await ffmpegUtils.createThumbnail(videoPath, thumbPath);

        return {
            ...pendingMedia,
            ...entries,
            status: "ready",
            type: "video"
        }
    } catch (err) {
        logger.error(err);
        await fsp.unlink(videoPath)
            .then(() => logger.info(`Unlinked ${videoPath}`))
            .catch(e => logger.warn(`Failed to unlink ${e.message}`))
        await fsp.unlink(thumbPath)
            .then(() => logger.info(`Unlinked ${thumbPath}`))
            .catch(e => logger.warn(`Failed to unlink ${e.message}`))
        throw err;
    }
}

const postUploadService = {
    createPendingMedia: createPendingMedia, processMedia
}

export default postUploadService;