import { generateMediaPath, MEDIA_DIR, THUMB_EXT } from "#/config/config.js";
import ffmpegUtils from "#/util/ffmpegUtils.js";
import logger from "#/util/logger.js";
import fsp from "fs/promises";
import path from "path";
import db from "./db/database.js";
import mediaRepository from "./media.repository.js";
import { MediaResponse } from "./types/media.response.js";
import { Media, MediaType, ReadyMedia } from "./types/media.types.js";
import { HttpError } from "#/error/error.js";

const mediaService = {
    existsMedia: (hash: string) => mediaRepository.existsById(hash),
    getMediaList: (type?: MediaType) => {
        return mediaRepository.findAll(type)
            .map(media => toMediaResponse(media))
    },
    getMedia: (id: string) => {
        const media = mediaRepository.findById(id);
        if (!media) throw new HttpError(404, "Media not found");
        return toMediaResponse(media);
    },
    downloadMedia: (id: string) => {
        const media = mediaRepository.findById(id);
        if (!media) throw new HttpError(404, "Media not found");
        
        const mediaPath = path.join(MEDIA_DIR, generateMediaPath(id, media.ext));
        return {
            fileName: media.fileName,
            filePath: mediaPath
        }
    },
    deleteMedia: async (id: string) => {
        const media = mediaRepository.findById(id);
        if (!media) throw new HttpError(404, "Media not found");

        const mediaPath = path.join(MEDIA_DIR, generateMediaPath(id, media.ext))
        if (media.type === "image")
            await fsp.unlink(mediaPath);
        else {
            const thumbPath = path.join(MEDIA_DIR, generateMediaPath(id, THUMB_EXT));
            await Promise.all([
                fsp.unlink(mediaPath),
                fsp.unlink(thumbPath)
            ]);
        }

        if (!mediaRepository.deleteById(id)) {
            logger.error(`Failed to delete media ${id}`);
            throw new HttpError(500, "Failed to delete");
        }

        logger.info(`Deleted media ${id}`);
        return mediaRepository.deleteById(id);
    },
    createThumbnail: (id: string, offset: number) => {
        const media = mediaRepository.findById(id);
        if (!media) throw new HttpError(404, "Media not found");
        if (media.type !== "video") throw new HttpError(400, "Media is not video");

        const videoPath = path.join(MEDIA_DIR, generateMediaPath(id, media.ext));
        const thumbPath = path.join(MEDIA_DIR, generateMediaPath(id, THUMB_EXT));
        return ffmpegUtils.createThumbnail(videoPath, thumbPath, offset);
    },
    saveMediaFile: (media: Media) => {
        return mediaRepository.saveMediaFile(media).changes > 0;
    },
    completeMedia: (media: ReadyMedia) => {
        try {
            db.exec("BEGIN");
            if (!mediaRepository.updateStatus(media.id, "ready")) {
                throw new HttpError(404, "Media not found");
            }
            mediaRepository.saveMediaMetadata(media);
            db.exec("COMMIT");
        } catch (err) {
            db.exec("ROLLBACK");
            throw err;
        }
    },
}

const toMediaResponse = (media: Media): MediaResponse => {
    const path = generateMediaPath(media.id, media.ext);
    const base = {
        id: media.id,
        fileName: media.fileName,
        fileSize: media.fileSize,
        ext: media.ext,
        mime: media.mime,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt
    };

    if (media.status !== "ready") {
        return {
            ...base,
            type: media.type,
            status: media.status
        }
    }

    if (media.type === "video") {
        const thumbPath = generateMediaPath(media.id, THUMB_EXT);
        return {
            ...base,
            type: media.type,
            status: media.status,
            width: media.width,
            height: media.height,
            duration: media.duration,
            fps: media.fps,
            url: `/media/${path}`,
            thumbnailUrl: `/media/${thumbPath}`,
            downloadUrl: `/media/download/${path}`
        }
    }
    return {
        ...base,
        type: media.type,
        status: media.status,
        width: media.width,
        height: media.height,
        url: `/media/${path}`,
        thumbnailUrl: `/media/${path}`,
        downloadUrl: `/media/download/${path}`
    }
}

export default mediaService;