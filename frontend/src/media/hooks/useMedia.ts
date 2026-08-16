import { useMediaDeleteMutation, useThumbnailCreateMutation } from "../queries/media.mutations";
import { useMediaQuery } from "../queries/media.queries";

export default function useMedia(id: string) {
    const query = useMediaQuery(id);
    const mediaDeleteMutation = useMediaDeleteMutation();
    const thumbnailCreateMutation = useThumbnailCreateMutation();

    const handleMediaDelete = () => mediaDeleteMutation.mutate(id);
    const handleThumbnailCreate = (offset: number) => thumbnailCreateMutation.mutate({id, offset});

    return {
        media: query.data,
        onMediaDelete: handleMediaDelete,
        onThumbnailCreate: handleThumbnailCreate,
        ...query
    }
}