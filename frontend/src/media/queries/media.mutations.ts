import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sha256 } from "js-sha256";
import plimit from "p-limit";
import { mediaApi, uploadApi } from "../api/media.api";
import type { MediaType } from "../api/media.api.response";
import type { UploadProgress } from "../types/media";
import { mediaKeys } from "./media.keys";

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

const sliceFile = (file: File, chunkSize: number) => {
    const chunks = [];

    for (
        let index = 0, start = 0, end = 0;
        start < file.size;
        start = end, index++
    ) {
        end = start + chunkSize;
        const blob = file.slice(start, end);

        chunks.push({ index, blob });
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
                return networkLimit(async () => {
                    const hash = await getHash(file);
                    return uploadApi.uploadSingle(
                        contract.sessionId,
                        file,
                        hash,
                        p => onUploadProgress?.({
                            ...p,
                            total: file.size,
                        })
                    )
                })
            }

            // Chunk Upload
            const progressMap = createProgressMap(file.size, onUploadProgress);
            const chunks = sliceFile(file, contract.chunkSize);

            const result = await Promise.allSettled(chunks.map(({ blob, index }) => networkLimit(async () => {
                const hash = await getHash(blob);
                return uploadApi.uploadPart(
                    contract.sessionId,
                    { blob, hash, index },
                    p => progressMap.update(index, p.loaded, p.bytes)
                )
            })));

            console.log(result);

            if (result.filter(v => v.status === "rejected").length > 0)
                throw new Error("Rejected part detected");

            console.log(`All parts uploaded from ${file.name}`);
            return uploadApi.merge(contract.sessionId);
        }
    })
}