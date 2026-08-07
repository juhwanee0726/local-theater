import { prepareStatements } from "../db/database.js";
import { uploadSessionStmt } from "../db/statement.js";
import { Chunk, UploadChunkRow, UploadSession, UploadSessionRow, UploadSessionStatus, UploadType } from "../types/upload.types.js";
import { toUploadChunkRow, toUploadSession, toUploadSessionRow } from "./upload.mapper.js";

const stmt = prepareStatements(uploadSessionStmt);

const uploadSessionRepository = {
    findById: (sessionId: string) => {
        const row = stmt.findSessionById.get(sessionId) as UploadSessionRow | undefined;
        if (!row) return undefined;
        const rows = (row.upload_type === "chunk"
            ? stmt.findChunksById.all(sessionId)
            : []
        ) as UploadChunkRow[]
        return toUploadSession(row, rows);
    },
    findAll: (uploadType?: UploadType) => {
        const rows = (uploadType
            ? stmt.findSessionsByUploadType.all(uploadType)
            : stmt.findAllSessions.all()) as UploadSessionRow[];
        return rows.map(row => toUploadSession(row, []));
    },
    updateStatus: (sessionId: string, status: UploadSessionStatus) => stmt.updateStatusById.run(status, sessionId).changes > 0,
    save: (session: UploadSession) => {
        const row = toUploadSessionRow(session);
        stmt.saveUploadSession.run(row);
    },
    saveChunk: (sessionId: string, chunk: Chunk) => {
        stmt.saveChunk.run(toUploadChunkRow(sessionId, chunk));
    },
    deleteById: (sessionId: string) => stmt.deleteById.run(sessionId).changes > 0
}
export default uploadSessionRepository;