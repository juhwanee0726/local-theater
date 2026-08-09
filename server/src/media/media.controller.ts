import { RequestHandler } from "express";
import mediaService from "./media.service.js";
import { MediaResponse } from "./types/media.response.js";
import { MediaType } from "./types/media.types.js";
import path from "node:path";
import { generateMediaPath, MEDIA_DIR } from "#/config/config.js";

/** GET /api/media */
const getMediaList: RequestHandler<{}, MediaResponse[], any, { type: MediaType }> = (req, res) => {
    res.json(mediaService.getMediaList(req.query.type))
}

/** GET /api/media/:id */
const getMedia: RequestHandler<{ id: string }, MediaResponse> = (req, res) => {
    res.json(mediaService.getMedia(req.params.id));
}

/** POST /api/media/:id/thumbnail */
const createThumbnail: RequestHandler<{ id: string }, void, { offset: number }> = async (req, res) => {
    const { offset } = req.body;
    await mediaService.createThumbnail(req.params.id, offset)
    res.sendStatus(201);
}

/** DELETE /api/media/:id */
const deleteMedia: RequestHandler<{ id: string }> = (req, res) => {
    mediaService.deleteMedia(req.params.id)
    res.sendStatus(200);
}

const downloadMedia: RequestHandler<{ id: string }> = (req, res) => {
    const media = mediaService.getMedia(req.params.id);
    const mediaPath = path.join(MEDIA_DIR, generateMediaPath(media.id, media.ext));
    res.setHeader("Content-Disposition", `attachment; fileName=${media.fileName}`);
    res.sendFile(mediaPath);
}

const mediaController = {
    getMediaList, getMedia,
    createThumbnail,
    deleteMedia,
    downloadMedia
}
export default mediaController;