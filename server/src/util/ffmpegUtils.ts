import { HttpError } from "#/error/error.js";
import { $, ExecaError } from "execa";
import path from "path";
import logger from "./logger.js";

interface Stream {
    width: number,
    height: number,
    avg_frame_rate: string,
    codec_name: string
}

interface Format {
    duration: string
}

interface FFProbeData {
    streams: Stream[],
    format: Format
}

const ffmpegUtils = {
    createThumbnail: async (srcPath: string, destPath: string, offset: number = 1, ext: string = "png") => {
        try {
            const { durationMs } = await $("ffmpeg", [
                "-y",
                "-ss", String(offset),
                "-i", srcPath,
                "-frames", "1",
                "-vcodec", ext,
                "-update", "1",
                destPath
            ]);
            logger.info(`Created thumbnail ${path.basename(destPath)}: ${durationMs}`);
        } catch (err) {
            if (err instanceof ExecaError) {
                const { shortMessage, exitCode, command } = err;
                logger.error({ exitCode, command }, `[ExecaError] ${shortMessage}`);
                throw new HttpError(500, `Failed to create thumbnail`, undefined, {cause: err});
            }
            throw err;
        }
    },
    extractVideoEntries: async (srcPath: string) => {
        const { stdout } = await $("ffprobe", [
            "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=width,height,avg_frame_rate,codec_name",
            "-show_entries", "format=duration",
            "-of", "json",
            srcPath
        ]);

        const data: FFProbeData = JSON.parse(stdout);
        const duration = Number(data.format.duration);
        const { avg_frame_rate, height, width } = data.streams[0];

        const [a, b] = avg_frame_rate.split("/");
        const fps = Number(a) / Number(b ?? 1);

        return {
            width, height, duration, fps
        }
    }
}

export default ffmpegUtils;