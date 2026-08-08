import { HttpError } from "#/error/error.js";
import { RequestHandler } from "express";
import { UploadSessionCreateRequest } from "../types/upload.request.js";
import { UploadSessionCreateResponse, UploadSessionResponse } from "../types/upload.response.js";
import { UploadSession, UploadType } from "../types/upload.types.js";
import chunkUploadService from "./chunk-upload.service.js";
import postUploadService from "./post-upload.service.js";
import singleUploadSevice from "./single-upload.service.js";
import uploadSessionService from "./upload-session.service.js";

/** GET /api/uploads */
const getUploadSessions: RequestHandler<{}, UploadSession[], void, {uploadType?: UploadType}> = (req, res) => {
    const response = uploadSessionService.getUploadSessions(req.query.uploadType);
    res.json(response);
}

/** POST /api/uploads */
const createUploadSession: RequestHandler<{}, UploadSessionCreateResponse, UploadSessionCreateRequest> = (req, res) => {
    const response = uploadSessionService.createUploadSession(req.body);
    res.json(response)
}

/** GET /api/uploads/:sessionId */
const getUploadSession: RequestHandler<{ sessionId: string }, UploadSessionResponse> = (req, res) => {
    const response = uploadSessionService.getUploadSession(req.params.sessionId);
    res.json(response);
}

/** PUT /api/uploads/:sessionId/file */
const uploadSingle: RequestHandler<{ sessionId: string }> = async (req, res) => {
    const oriHash = req.header("x-file-hash");
    if (!oriHash)
        throw new HttpError(400, "Required \"x-file-hash\" header");

    const tmp = await singleUploadSevice.upload(req, req.params.sessionId, oriHash);
    const pendingMedia = await postUploadService.createPendingMedia(tmp);

    res.sendStatus(201);
    postUploadService.processMedia(pendingMedia);
}

/** PUT /api/uploads/:sessionId/chunks/:index */
const uploadPart: RequestHandler<{ sessionId: string, index: string }> = async (req, res) => {
    const oriHash = req.header("x-chunk-hash");
    if (!oriHash)
        throw new HttpError(400, "Required \"x-chunk-hash\" header");
    
    await chunkUploadService.uploadPart(req, req.params.sessionId, Number(req.params.index), oriHash);
    res.sendStatus(201);

}

/** POST /api/uploads/:sessionId/chunks/merge */
const mergeParts: RequestHandler<{sessionId: string}> = async (req, res) => {
    const tmp = await chunkUploadService.merge(req.params.sessionId);
    const pendingMedia = await postUploadService.createPendingMedia(tmp);
    res.sendStatus(202);

    postUploadService.processMedia(pendingMedia);
}

const uploadController = {
    getUploadSessions, getUploadSession,
    uploadSingle, uploadPart,
    mergeParts,
    createUploadSession,
}
export default uploadController;