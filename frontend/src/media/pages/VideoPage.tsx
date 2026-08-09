import { useNavigate, useParams } from "react-router"
import useMedia from "../hooks/useMedia";
import Panel from "#/components/panel/Panel";
import { faDownload, faImage, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "../css/media.css";
import { formatDataUnit, formatTime } from "#/utils/FormatUtils";
import ThumbnailChangeModal from "../components/ThumbnailChangeModal";
import { useState } from "react";
import Modal from "#/components/modal/Modal";
import Button from "#/components/button/Button";

type ModalType = "thumb" | "delete";

export default function VideoPage() {
    const { id } = useParams();
    const { media, onDeleteMedia, onCreateThumbnail } = useMedia(id!);

    const [modal, setModal] = useState<Record<ModalType, boolean>>({
        thumb: false,
        delete: false
    });
    const navigate = useNavigate();

    const handleDeleteMedia = () => {
        onDeleteMedia();
        navigate("/videos");
    }

    const handleCreateThumbnail = (offset: number) => {
        onCreateThumbnail(offset);
        navigate("/videos");
    }

    const modalHandler: { [k in ModalType]: { [k in "open" | "close"]: () => void } } = {
        thumb: {
            open: () => setModal(prev => ({ ...prev, thumb: true })),
            close: () => setModal(prev => ({ ...prev, thumb: false })),
        },
        delete: {
            open: () => setModal(prev => ({ ...prev, delete: true })),
            close: () => setModal(prev => ({ ...prev, delete: false })),
        },
    }

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
                    <Panel.Button icon={faTrashCan} label="삭제" onClick={modalHandler.delete.open} />
                    <Panel.Button icon={faImage} label="썸네일 변경" onClick={modalHandler.thumb.open} />
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

            {modal.thumb && (
                <ThumbnailChangeModal
                    video={media}
                    onClose={modalHandler.thumb.close}
                    onConfirm={handleCreateThumbnail}
                />
            )}

            {modal.delete && (
                <Modal onClose={modalHandler.delete.close}>
                    <Modal.Header text="영상 삭제" />
                    <Modal.Content>
                        <p>{`"${media.id}"을 삭제합니다.`}</p>
                        <p><i>삭제는 되돌릴 수 없습니다.</i></p>
                    </Modal.Content>
                    <Modal.Action>
                        <Button label="확인" color="primary" colorType="confirm" onClick={handleDeleteMedia} />
                        <Button label="취소" color="secondary" onClick={modalHandler.delete.close} />
                    </Modal.Action>
                </Modal>
            )}

        </main>
    )
}