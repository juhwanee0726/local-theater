import { useNavigate, useParams } from "react-router"
import useMedia from "../hooks/useMedia";
import Panel from "#/components/panel/Panel";
import { faDownload, faImage, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "../css/media.css";
import { formatDataUnit, formatTime } from "#/utils/FormatUtils";
import ThumbnailChangeModal from "../components/ThumbnailChangeModal";
import { useState } from "react";

export default function VideoPage() {
    const { id } = useParams();
    const { media, onDeleteMedia, onCreateThumbnail } = useMedia(id!);
    const [isThumbModalOpen, setIsThumbModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleDeleteMedia = () => {
        onDeleteMedia();
        navigate("/videos");
    }

    const handleCreateThumbnail = (offset: number) => {
        onCreateThumbnail(offset)
        navigate("/videos");

    }

    const handleToggleThumbChangeModal = () => setIsThumbModalOpen(prev => !prev);
    const handleCloseThumbChangeModal = () => setIsThumbModalOpen(false);
    

    if (!media || media.type === "image") return null;

    return (
        <main id="video-page">
            <title>{media.name}</title>
            <section className="video-player">
                <video src={media.src} controls />
            </section>
            <section>
                <Panel>
                    <Panel.Anchor icon={faDownload} label="다운로드" href={media.downloadUrl} />
                    <Panel.Button icon={faTrashCan} label="삭제" onClick={handleDeleteMedia} />
                    <Panel.Button icon={faImage} label="썸네일 변경" onClick={handleToggleThumbChangeModal} />
                </Panel>
            </section>
            <section className="description">
                <p>id: {media.id}</p>
                <p>name: {media.name}</p>
                <p>size: {formatDataUnit(media.size)}</p>
                <p>createdAt: {formatTime(media.createdAt)}</p>                
                <p>resolution: {media.width}x{media.height}</p>
                <p>duration: {media.duration}s</p>
                <p>fps: {media.fps}</p>
            </section>

            {isThumbModalOpen && <ThumbnailChangeModal onClose={handleCloseThumbChangeModal} onConfirm={handleCreateThumbnail} video={media}/>}

        </main>
    )
}