import path from "path";

export const SESSION_EXPIRES_MILL = 86400 * 1000;
// export const MAX_SINGLE_SIZE = 50 * 1024 * 1024;
export const MAX_SINGLE_SIZE = 10 * 1024 * 1024;
export const CHUNK_SIZE = 8 * 1024 * 1024;

export const HASH_ALGORITHM = "sha256";
export const THUMB_EXT = "png";

/** /public */
const PUBLIC_DIR = path.resolve(process.cwd(), "public");

/** /data */
const DATA_DIR = path.resolve(process.cwd(), "data");

export const DB_PATH = path.join(DATA_DIR, "db", "media.sqlite");

/** /data/tmp */
export const TMP_DIR = path.join(DATA_DIR, "tmp");

/** /data/tmp/chunks */
export const CHUNKS_DIR = path.join(TMP_DIR, "chunks");

/** /app/public/media */
export const MEDIA_DIR = path.join(PUBLIC_DIR, "media");

/** "ab/cd/abcdefg.mp4" */
export const generateMediaPath = (hash: string, ext: string) => path.join(hash.slice(0, 2), hash.slice(2, 4), `${hash}.${ext}`)