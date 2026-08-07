import { useMemo, useState } from "react";
import { useMediaCardsQuery } from "../queries/media.queries";
import type { MediaCard, MediaSortKey, MediaSortMode, MediaSortOrder } from "../types/media";
import type { MediaType } from "../api/media.api.response";
import { countRender } from "#/debug/countRender";

const shuffleArray = <T>(data: T[]) => {
    const copied = [...data];
    for (let i = copied.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
    }
    return copied;
}

const comparator: Record<MediaSortKey, (a: MediaCard, b: MediaCard) => number> = {
    id: (a, b) => a.id.localeCompare(b.id),
    createdAt: (a, b) => a.createdAt - b.createdAt,
    size: (a, b) => a.size - b.size
}

export default function useMediaCards(type: MediaType) {
    const query = useMediaCardsQuery(type);
    const [sortMode, setSortMode] = useState<MediaSortMode>({ type: "sort", key: "createdAt", order: "desc" });

    const sortedMediaCards = useMemo(() => {
        const data = query.data;
        if (!data) return [];

        if (sortMode.type === "shuffle") {
            return shuffleArray<MediaCard>(data);
        }
        const copied = [...data];
        return copied.sort((a, b) => comparator[sortMode.key](a, b) * (sortMode.order === "asc" ? 1 : -1))
    }, [query.data, sortMode]);

    countRender("useMediaCards");

    return {
        ...query,
        mediaCards: sortedMediaCards,
        sortMode,
        sortByKey: (key: MediaSortKey) => setSortMode(prev => prev.type === "shuffle"
            ? { type: "sort", key, order: "asc" }
            : { ...prev, key }
        ),
        sortByOrder: (order: MediaSortOrder) => setSortMode(prev => prev.type === "shuffle"
            ? { type: "sort", key: "id", order }
            : { ...prev, order }
        ),
        shuffle: () => {
            setSortMode({ type: "shuffle" })
        }
    }
}