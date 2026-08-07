import { RequestHandler } from "express";
import mediaService from "./media.service.js";
import { MediaResponse } from "./types/media.response.js";
import { MediaType } from "./types/media.types.js";

/** GET /api/media */
const getMediaList: RequestHandler<{}, MediaResponse[], any, { type: MediaType }> = (req, res) => {
    res.json(mediaService.getMediaList(req.query.type))
}

/** GET /api/media/:id */
const getMedia: RequestHandler<{id: string}, MediaResponse> = (req, res) => {
    res.json(mediaService.getMedia(req.params.id));
}

/** POST /api/media/:id/thumbnail */
const createThumbnail: RequestHandler<{id: string}, void, {offset: number}> = async (req, res) => {
    const {offset} = req.body;
    await mediaService.createThumbnail(req.params.id, offset)
    res.sendStatus(201);
}

/** DELETE /api/media/:id */
const deleteMedia: RequestHandler<{id: string}> = (req, res) => {
    mediaService.deleteMedia(req.params.id)
    res.sendStatus(200);
}

const mediaController = {
    getMediaList, getMedia,
    createThumbnail,
    deleteMedia
}
export default mediaController;