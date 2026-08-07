import { json, Router } from "express";
import uploadController from "./upload.controller.js";

const router = Router();

/** GET /api/media/uploads */
router.get("/", uploadController.getUploadSessions);

/** POST /api/media/uploads */
router.post("/", json(), uploadController.createUploadSession);

/** GET /api/media/uploads/:sessionId */
router.get("/:sessionId", uploadController.getUploadSession);

/** PUT /api/media/uploads/:sessionId/file */
router.put("/:sessionId/file", uploadController.uploadSingle);

/** PUT /api/media/uploads/:sessionId/chunks/:index */
router.put("/:sessionId/chunks/:index", uploadController.uploadPart);

/** POST /api/media/uploads/:sessionId/chunks/merge */
router.post("/:sessionId/chunks/merge", uploadController.mergeParts);

export default router;