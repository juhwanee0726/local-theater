import cors from "cors";
import express from "express";
import { errorHandler } from "./error/errorHandler.js";
import mediaRouter from "./media/media.routes.js";
import uploadRouter from "./media/upload/upload.routes.js";
import logger from "./util/logger.js";

process.on("unhandledRejection", err => logger.error(err, "[UnhandledRejection]"));

const port = 8080;
const app = express();

app.use(cors({ origin: "*" }));
app.use("/api/uploads", uploadRouter);
app.use("/api/media", mediaRouter);
app.use("/media", express.static("data/media"));
app.use("/media/download", (_req, res, next) => {
    res.setHeader("Content-Disposition", "attachment");
    next();
});
app.use("/media/download", express.static("data/media"));
app.use("/api/debug", express.json(), (req, res) => {
    const body = req.body;
    res.json(body);
    logger.error(body, "Received");
})

app.use(errorHandler);

const server = app.listen(port, () => logger.info(`Server listening on ${port}`));

process.on("SIGTERM", () => {
    console.log("Received terminate signal. Closing...");
    server.close(() => process.exit(0));
})
