import { formatDataUnit, formatTime } from "#/utils/FormatUtils";
import { Link } from "react-router";
import type { MediaCard } from "../types/media";

type ThumbnailPreviewCardProps = MediaCard & {
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
}

export default function ThumbnailPreviewCard({ canvasRef, ...card}: ThumbnailPreviewCardProps) {
    return (
        <Link className="card" to="#">
            <canvas className="thumbnail"
                ref={canvasRef}
            />
            <div className="description">
                <p className="name">{card.id}</p>
                <div>
                    <p className="size">{formatDataUnit(card.size)}</p>
                    <p className="mtime">{formatTime(card.createdAt)}</p>
                </div>
            </div>
        </Link>
    )
}