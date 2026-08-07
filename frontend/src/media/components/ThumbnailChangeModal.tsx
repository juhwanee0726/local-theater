import Button from "#/components/button/Button";
import Modal from "#/components/modal/Modal";
import "#/media/css/thumb-change-modal.css";
import Gallery from "#/media/components/Gallery";
import GalleryCard from "#/media/components/GalleryCard";
import { useEffect, useRef, useState } from "react";
import type { Video } from "../types/media";
import ThumbnailPreviewCard from "./ThumbnailPreviewCard";

type ThumbnailChangeModalProps = {
    video: Video
    onConfirm: (offset: number) => void,
    onClose: () => void
}

export default function ThumbnailChangeModal({ video, onConfirm, onClose }: ThumbnailChangeModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [curTime, setCurTime] = useState<number>(0);

    useEffect(() => {
        const videoElem = videoRef.current;
        const canvasElem = canvasRef.current;
        const ctx = canvasElem?.getContext("2d");

        if (!video || !videoElem || !canvasElem || !ctx)
            return;

        canvasElem.width = video.width;
        canvasElem.height = video.height;

        const drawThumbnail = () => ctx.drawImage(videoElem, 0, 0);

        videoElem.addEventListener("seeked", drawThumbnail);
        videoElem.addEventListener("loadeddata", drawThumbnail);
        return () => {
            videoElem.removeEventListener("seeked", drawThumbnail)
            videoElem.removeEventListener("loadeddata", drawThumbnail);
        };
    }, [video])

    useEffect(() => {
        if (!videoRef.current) return;
        videoRef.current.currentTime = curTime;
    }, [curTime])

    const handleChangeCurTime = (e: React.InputEvent<HTMLInputElement>) => setCurTime(Number(e.currentTarget.value));

    const handleMove = (direction: "next" | "prev") => {
        if (!video) return;
        const frame = 1 / video.fps;
        setCurTime(prev => direction === "next"
            ? Math.min(prev + frame, video.duration)
            : Math.max(prev - frame, 0)
        )
    }

    if (!video) return null;

    return (
        <Modal onClose={onClose}>
            <Modal.Header text="썸네일 생성" />
            <Modal.Content>
                <div className="thumb-change-modal">
                    <div className="video-player">
                        <video
                            src={video.src}
                            ref={videoRef}
                            playsInline
                            preload="metadata"
                        />
                    </div>
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <Gallery>
                        <GalleryCard
                            type="video"
                            id={video.id}
                            src={video.thumbnailUrl}
                            createdAt={video.createdAt}
                            size={video.size}
                        />
                        <ThumbnailPreviewCard
                            canvasRef={canvasRef}
                            type="video"
                            id={video.id}
                            src={video.thumbnailUrl}
                            createdAt={video.createdAt}
                            size={video.size}
                        />
                    </Gallery>
                    <div className="thumb-control">
                        <p>{curTime} / {video.duration}</p>
                        <input
                            type="range"
                            value={curTime}
                            min={0}
                            max={video.duration}
                            step={1 / video.fps}
                            onInput={handleChangeCurTime}
                        />
                        <div className="thumb-control__btn">
                            <button onClick={() => handleMove("prev")}>{`<`}</button>
                            <button onClick={() => handleMove("next")}>{`>`}</button>
                        </div>
                    </div>
                </div>
            </Modal.Content>
            <Modal.Action>
                <Button label="썸네일 만들기" colorType="confirm" onClick={() => onConfirm(curTime)} />
                <Button label="취소" color="tertiary" onClick={onClose} />
            </Modal.Action>
        </Modal>
    )
}