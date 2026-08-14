import { formatDataUnit, formatTime } from "#/utils/FormatUtils";
import React from "react";
import { Link } from "react-router";
import type { MediaType } from "../api/media.api.response";
import type { MediaCard } from "../types/media";
import "#/media/css/gallery.css";

const linkTo: Record<MediaType, (id: string) => string> = {
    image: id => `/images/${id}`,
    video: id => `/videos/${id}`
}

function GalleryCard({ id, type, src, size, createdAt, showDescription }: MediaCard) {
    return (
        <Link className="card" to={linkTo[type](id)}>
            <img className="thumbnail"
                loading="lazy"
                src={src}
            />
            {showDescription && <div className="description">
                <p className="name">{id}</p>
                <div>
                    <p className="size">{formatDataUnit(size)}</p>
                    <p className="mtime">{formatTime(createdAt)}</p>
                </div>
            </div>}
        </Link>
    )
}

export default React.memo(GalleryCard);