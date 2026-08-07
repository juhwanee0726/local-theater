import {Router, json} from "express";
import mediaController from "./media.controller.js";

const router = Router();

/** GET /api/media */
router.get("/", mediaController.getMediaList);

/** GET /api/media/:id */
router.get("/:id", mediaController.getMedia);

/** DELETE /api/media/:id */
router.delete("/:id", mediaController.deleteMedia);

/** POST /api/media/:id/thumbnail */
router.post("/:id/thumbnail", json(), mediaController.createThumbnail);

export default router;