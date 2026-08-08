import { useMutation, useQueryClient } from "@tanstack/react-query";
import plimit from "p-limit";
import { mediaApi, uploadApi } from "../api/media.api";
import type { MediaType } from "../api/media.api.response";
import { mediaKeys } from "./media.keys";
import type { UploadProgress } from "../types/media";
import { sha256 } from "js-sha256";

export const networkLimit = plimit(5);

export const useMediaDeleteMutation = (type?: MediaType) => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => mediaApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: mediaKeys.list(type) })
        }
    })
}

export const useThumbnailCreateMutation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, offset }: { id: string, offset: number }) => mediaApi.createThumbnail(id, offset),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: mediaKeys.list() })
        }
    })
}

//
// ----- Upload --------------------------------------------------
//

// const getHash = async (file: File | Blob, algorithm: string) => {
//     const fileBuffer = await file.arrayBuffer();
//     const hashBuffer = await crypto.subtle.digest(algorithm, fileBuffer);
//     const hash = Array.from(new Uint8Array(hashBuffer))
//         .map(digit => digit.toString(16).padStart(2, "0"))
//         .join("");
//     return hash;
// }

const getHash = async (file: File | Blob) => sha256(await file.bytes());

const sliceFile = async (file: File, chunkSize: number) => {
    const chunks = [];

    for (
        let index = 0, start = 0, end = 0;
        start < file.size;
        start = end, index++
    ) {
        end = start + chunkSize;
        const blob = file.slice(start, end);
        const hash = await getHash(blob);

        chunks.push({ index, blob, hash });
    }
    return chunks;
}

const createProgressMap = (total: number, onUploadProgress?: (p: UploadProgress) => void) => {
    const loadedMap = new Map<number, number>();
    let lastLoaded = 0;
    let lastTimestamp = performance.now();

    return {
        update: (index: number, loaded: number, bytes?: number) => {
            loadedMap.set(index, loaded);

            const totalLoaded = [...loadedMap.values()].reduce((sum, value) => sum + value, 0);

            const now = performance.now();

            const deltaBytes = totalLoaded - lastLoaded;
            const deltaSeconds = (now - lastTimestamp) / 1000;

            const speed = deltaSeconds > 0
                ? deltaBytes / deltaSeconds
                : 0;

            const remainingBytes = total - totalLoaded;

            const remainingTime = speed > 0
                ? remainingBytes / speed
                : undefined;

            onUploadProgress?.({
                loaded: totalLoaded,
                total: total,
                bytes: bytes,
                rate: speed,
                estimated: remainingTime
            })

            lastLoaded = totalLoaded;
            lastTimestamp = now;
        }
    }
}

type UploadMutationProps = {
    file: File,
    onUploadProgress?: (p: UploadProgress) => void
}
export const useMediaUploadMutation = (type: MediaType) => {
    return useMutation({
        mutationFn: async ({ file, onUploadProgress }: UploadMutationProps) => {
            const contract = await uploadApi.createUploadSession({
                type,
                fileName: file.name,
                fileSize: file.size,
            });

            // Single Upload
            if (contract.uploadType === "single") {
                const hash = await getHash(file);

                return networkLimit(uploadApi.uploadSingle,
                    contract.sessionId, file, hash,
                    p => onUploadProgress?.({
                        ...p,
                        total: file.size,
                    })
                )
            }

            // Chunk Upload
            const progressMap = createProgressMap(file.size, onUploadProgress);
            const chunks = await sliceFile(file, contract.chunkSize);

            await Promise.all(chunks.map(chunk => networkLimit(
                uploadApi.uploadPart,
                contract.sessionId, chunk,
                p => progressMap.update(chunk.index, p.loaded, p.bytes)
            )));

            console.log(`All parts uploaded from ${file.name}`);
            return uploadApi.merge(contract.sessionId);
        }
    })
}