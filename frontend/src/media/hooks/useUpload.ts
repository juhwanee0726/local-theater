import pLimit from "p-limit";
import { useState } from "react";
import type { MediaType } from "../api/media.api.response";
import { useMediaUploadMutation } from "../queries/media.mutations";
import type { UploadItem } from "../types/media";
import { useQueryClient } from "@tanstack/react-query";
import { mediaKeys } from "../queries/media.keys";

export const uploadLimit = pLimit(3);

export default function useUpload(type: MediaType) {
    const qc = useQueryClient();
    const mutation = useMediaUploadMutation(type);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<Record<string, UploadItem>>({});

    const addProgress = (id: string, p: UploadItem) => setUploadProgress(prev => ({
        ...prev,
        [id]: p
    }))

    const deleteProgressEntry = (id: string) => setUploadProgress(prev => {
        const copied = { ...prev };
        delete copied[id];
        return copied;
    })

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setIsUploading(true);
        const files = Array.from(e.target.files);

        try {
            const results = await Promise.allSettled(files.map(async file => {
                const id = crypto.randomUUID();
                return uploadLimit(
                    mutation.mutateAsync,
                    { file, onUploadProgress: p => addProgress(id, { file, progress: p }) },
                ).finally(() => deleteProgressEntry(id))
            }));
            console.log(results);
        } catch (err) {
            console.error(err);
        }
        setIsUploading(false);
        await qc.invalidateQueries({ queryKey: mediaKeys.list(type) });
    }

    return {
        progress: uploadProgress,
        isUploading,
        onUpload
    }

}