import { useQuery } from "@tanstack/react-query"
import { mediaApi } from "../api/media.api"
import type { MediaType, ReadyMediaResponse } from "../api/media.api.response"
import type { Media, MediaCard } from "../types/media"
import { mediaKeys } from "./media.keys"
import { isAxiosError } from "axios"

export const useMediaCardsQuery = (type: MediaType) => {
    return useQuery({
        queryKey: mediaKeys.list(type),
        queryFn: () => mediaApi.list(type),
        select: list => list.filter(item => item.status === "ready").map(item => toMediaCard(item)),
        refetchInterval: query => {
            // console.log({ queryHash: query.queryHash, state: query.state });
            return query.state.data?.some(d => d.status === "pending") ? 2000 : false;
        }
    })
}

export const useMediaQuery = (id: string) => {
    return useQuery({
        queryKey: mediaKeys.detail(id),
        queryFn: () => mediaApi.get(id),
        retry: (failureCount, error) => {
            if (isAxiosError(error) && error.response?.status === 404) {
                return false;
            }
            return failureCount < 3;
        },
        select: item => item.status === "ready" ? toMedia(item) : undefined,
        refetchInterval: query => {
            // console.log({ queryKey: query.queryHash, state: query.state });
            return query.state.data?.status === "pending" ? 1000 : false;
        }
    })
}


const toMediaCard = (res: ReadyMediaResponse): MediaCard => ({
    id: res.id,
    type: res.type,
    size: res.fileSize,
    name: res.fileName,
    src: res.thumbnailUrl,
    createdAt: res.createdAt
});

const toMedia = (res: ReadyMediaResponse): Media => {
    const base = {
        ...toMediaCard(res),
        src: res.url,
        width: res.width,
        height: res.height,
        downloadUrl: res.downloadUrl,
        thumbnailUrl: res.thumbnailUrl
    };
    if (res.type === "video") {
        return {
            ...base,
            type: res.type,
            duration: res.duration,
            fps: res.fps
        }
    }
    return {
        ...base,
        type: res.type,
    }
}