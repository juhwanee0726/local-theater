import { ErrorRequestHandler } from "express";
import { HttpError } from "./error.js";
import logger from "#/util/logger.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (!(err instanceof Error)) {
        logger.error(err, "UnhandledError");
        res.status(500).send("Unhandled Error");
        return;
    }

    if (err.message === "aborted") {
        res.status(400);
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.status).json(err.toJSON());
        return;
    }

    if (err.message === "aborted") {
        logger.error(err.message);
        res.sendStatus(400);
    }

    logger.error(err, "Caught on global handler");
    res.status(500).send(err.message);
}