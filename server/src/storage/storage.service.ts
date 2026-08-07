import { HASH_ALGORITHM } from "#/config/config.js";
import logger from "#/util/logger.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "path";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";

const storageService = {
    writeFile: async (file: Readable, destPath: string) => {
        const dir = path.dirname(destPath);
        try {
            await fsp.mkdir(dir, { recursive: true });

            const hash = createHash(HASH_ALGORITHM);
            let size = 0;
            const transform = new Transform({
                transform: (chunk: Buffer, _, cb) => {
                    size += chunk.byteLength;
                    hash.update(chunk);
                    cb(null, chunk);
                }
            })

            const ws = fs.createWriteStream(destPath);
            await pipeline(file, transform, ws);

            return {
                size,
                hash: hash.digest("hex")
            }

        } catch (err) {
            await fsp.unlink(destPath)
                .then(() => logger.info(`Unlinked ${destPath}`))
                .catch(e => logger.warn(`Failed to unlink ${e.message}`))
            await fsp.rmdir(dir)
                .then(() => logger.info(`Removed ${dir}`))
                .catch(() => {})
            throw err;
        }
    },
    mergeChunks: async (srcDir: string, destPath: string) => {
        try {
            await fsp.mkdir(path.dirname(destPath), { recursive: true });
            const chunks = (await fsp.readdir(srcDir))
                .sort((a, b) => a.localeCompare(b))
                .map(f => path.join(srcDir, f));

            const ws = fs.createWriteStream(destPath);
            const hash = createHash(HASH_ALGORITHM);

            let size = 0;
            for (const chunk of chunks) {
                await new Promise((resolve, reject) => {
                    const rs = fs.createReadStream(chunk);
                    rs.on("data", (data: Buffer) => {
                        size += data.byteLength;
                        hash.update(data);
                    });
                    rs.on("error", reject);
                    rs.on("end", resolve);
                    rs.pipe(ws, { end: false });
                })
            }
            return {
                size,
                hash: hash.digest("hex")
            }
        } catch (err) {
            await fsp.unlink(destPath).catch(e => logger.warn(`Failed to unlink ${e.msaage}`))
            throw err;
        }
    },
    moveFile: async (srcPath: string, destPath: string) => {
        const dir = path.dirname(destPath);
        await fsp.mkdir(dir, { recursive: true });
        await fsp.rename(srcPath, destPath);
    }
}

export default storageService;