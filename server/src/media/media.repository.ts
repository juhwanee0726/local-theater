import { prepareStatements } from "./db/database.js";
import { mediaStmt } from "./db/statement.js";
import { toMedia, toMediaDetailRow, toMediaFileRow } from "./media.mapper.js";
import { MediaBase, MediaRow, MediaStatus, MediaType, ReadyMedia } from "./types/media.types.js";

const stmt = prepareStatements(mediaStmt);

const mediaRepository = {
    existsById: (id: string) => !!stmt.existsById.get(id),
    findById: (id: string) => {
        const row = stmt.findById.get(id) as MediaRow | undefined;
        return row && toMedia(row);
    },
    findAll: (type?: MediaType) => {
        const rows = (type
            ? stmt.findAllByType.all(type)
            : stmt.findAll.all()
        ) as MediaRow[]
        return rows.map(row => toMedia(row));
    },
    deleteById: (id: string) => stmt.deleteById.run(id).changes > 0,
    updateStatus: (id: string, status: MediaStatus) => stmt.updateStatusById.run(status, id).changes > 0,
    saveMediaFile: (media: MediaBase) => stmt.saveMedia.run(toMediaFileRow(media)),
    saveMediaMetadata: (media: ReadyMedia) => stmt.saveMediaMeta.run(toMediaDetailRow(media))
}

export default mediaRepository;