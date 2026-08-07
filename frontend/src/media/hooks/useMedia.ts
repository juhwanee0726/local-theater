import { useMediaDeleteMutation, useThumbnailCreateMutation } from "../queries/media.mutations";
import { useMediaQuery } from "../queries/media.queries";

export default function useMedia(id: string) {
    const query = useMediaQuery(id);
    const mediaDeleteMutation = useMediaDeleteMutation();
    const thumbnailCreateMutation = useThumbnailCreateMutation();

    const handleDeleteMedia = () => mediaDeleteMutation.mutate(id);
    const handleCreateThumbnail = (offset: number) => thumbnailCreateMutation.mutate({id, offset});

    return {
        media: query.data,
        onDeleteMedia: handleDeleteMedia,
        onCreateThumbnail: handleCreateThumbnail,
        ...query
    }
}