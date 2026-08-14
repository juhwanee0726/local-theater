import { countRender } from "#/debug/countRender";
import { useMemo, useReducer } from "react";
import type { MediaType } from "../api/media.api.response";
import { useMediaCardsQuery } from "../queries/media.queries";
import type { MediaCard, MediaSortKey, MediaSortMode, MediaSortOrder } from "../types/media";

const createSeed = () => Math.floor(Math.random() * 2 ** 32);

const seededRandom = (seed: number) => {
    let value = seed;

    return () => {
        value = (value * 1664525 + 1013904223) >>> 0;
        return value / 2 ** 32;
    };
};

const shuffleArray = <T>(data: T[], seed: number) => {
    const copied = [...data];
    const random = seededRandom(seed);

    for (let i = copied.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copied[i], copied[j]] = [copied[j], copied[i]];
    }

    return copied;
};
const comparator: Record<MediaSortKey, (a: MediaCard, b: MediaCard) => number> = {
    id: (a, b) => a.id.localeCompare(b.id),
    createdAt: (a, b) => a.createdAt - b.createdAt,
    size: (a, b) => a.size - b.size
}

type Action =
    | { type: "shuffle" }
    | { type: "sort_by_key", payload: MediaSortKey }
    | { type: "sort_by_order", payload: MediaSortOrder }
    | { type: "sort", payload: { key: MediaSortKey, order: MediaSortOrder } }

const reducer = (state: MediaSortMode, action: Action): MediaSortMode => {
    switch (action.type) {
        case "shuffle": return {
            type: action.type,
            seed: createSeed()
        }
        case "sort_by_key": return {
            type: "sort",
            key: action.payload,
            order: (state.type === "shuffle") ? "asc" : state.order
        }
        case "sort_by_order": return {
            type: "sort",
            key: (state.type === "shuffle") ? "createdAt" : state.key,
            order: action.payload,
        }
        case "sort": return {
            type: "sort",
            key: action.payload.key,
            order: action.payload.order
        }
    }
}

export default function useMediaCards(type: MediaType) {
    const query = useMediaCardsQuery(type);
    const [state, dispatch] = useReducer(reducer, { type: "shuffle", seed: createSeed() })

    const sortedMediaCards = useMemo(() => {
        const data = query.data;
        if (!data) return [];

        if (state.type === "shuffle")
            return shuffleArray(data, state.seed)

        const copied = [...data];
        return copied.sort((a, b) => comparator[state.key](a, b) * (state.order === "asc" ? 1 : -1))
    }, [query.data, state]);

    const sortHandler = {
        onSortByKey: (key: MediaSortKey) => dispatch({ type: "sort_by_key", payload: key }),
        onSortByOrder: (order: MediaSortOrder) => dispatch({ type: "sort_by_order", payload: order }),
        onSort: (key: MediaSortKey, order: MediaSortOrder) => dispatch({ type: "sort", payload: { key, order } }),
        onShuffle: () => dispatch({ type: "shuffle" })
    }

    countRender("useMediaCards");

    return {
        ...query,
        sortHandler,
        sortMode: state,
        mediaCards: sortedMediaCards
    }
}