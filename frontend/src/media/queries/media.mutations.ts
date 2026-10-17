import { useMutation, useQueryClient } from "@tanstack/react-query";
import plimit from "p-limit";
import { mediaApi, uploadApi } from "../api/media.api";
import type { MediaType } from "../api/media.api.response";
import type { UploadProgress } from "../types/media";
import { mediaKeys } from "./media.keys";

export const networkLimit = plimit(3);

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
                    return uploadApi.uploadSingle(
                        contract.sessionId,
                        file,
                        p => onUploadProgress?.({
                            ...p,
                            total: file.size,
                        })
                    )
                })
            }

            // Chunk Upload
            const progressMap = createProgressMap(file.size, onUploadProgress);
            const chunkCnt = Math.ceil(file.size / contract.chunkSize);

            const result = await Promise.allSettled(Array.from({ length: chunkCnt }).map((_, index) => networkLimit(async () => {
                const start = index * contract.chunkSize;
                const blob = file.slice(start, start + contract.chunkSize);

                return uploadApi.uploadPart(
                    contract.sessionId,
                    { blob, index },
                    p => progressMap.update(index, p.loaded, p.bytes)
                ).then(() => console.log(`${file.name}-${index} uploaded`));
            })));

            console.log(result);

            if (result.filter(v => v.status === "rejected").length > 0)
                throw new Error("Rejected part detected");

            console.log(`All parts uploaded from ${file.name}`);
            return uploadApi.merge(contract.sessionId);
        }
    })
}