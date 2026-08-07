import type { MediaType } from "../api/media.api.response";

export const mediaKeys = {
    all: ["media"] as const,

    list: (type?: MediaType) => type
        ? [...mediaKeys.all, "list", type] as const
        : [...mediaKeys.all, "list"] as const,
    detail: (id: string) =>
        [...mediaKeys.all, "detail", id] as const,
};