import { countRender } from "#/debug/countRender"
import "#/media/css/gallery.css"

type GalleryProps = {
    children: React.ReactNode
}

export default function Gallery({children}: GalleryProps) {
    countRender("gallery");
    return (
        <div className="gallery scrollable">
            {children}
        </div>
    )
}

