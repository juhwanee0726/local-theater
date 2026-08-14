import Modal from "#/components/modal/Modal"
import { formatDataUnit, formatSecond } from "#/utils/FormatUtils"
import "#/media/css/modal.css";
import Progress from "#/components/progress/Progress";
import type { UploadItem } from "../types/media";
import React from "react";
import { networkLimit } from "../queries/media.mutations";
import { uploadLimit } from "../hooks/useUpload";

type UploadModalProps = {
    progress: Record<string, UploadItem>
}

const UploadModal = ({ progress }: UploadModalProps) => {
    const toStatus = (loaded: number, total?: number) => {
        if (!total)
            return "";
        const lot = `${formatDataUnit(loaded)} / ${formatDataUnit(total)}`;
        const percent = (loaded / total * 100).toFixed(2);
        return `${lot} (${percent}%)`;
    }

    const toSpeed = (rate?: number, estimated?: number) => {
        if (!rate || !estimated)
            return "";
        const speed = formatDataUnit(rate);
        const left = formatSecond(estimated);
        return `${speed}/s (${left} 남음)`;
    }

    return (
        <Modal>
            <Modal.Header text="Upload files" />
            <div style={{fontFamily: "monospace"}}>
                <p>NetworkLimit: {networkLimit.activeCount}/{networkLimit.concurrency} remain: {networkLimit.pendingCount}</p>
                <p>UploadLimit : {uploadLimit.activeCount}/{uploadLimit.concurrency} remain: {uploadLimit.pendingCount}</p>
            </div>
            <ul className="file-list">
                {Object.entries(progress).map(([k, v]) => {
                    const { loaded, total, estimated, rate } = v.progress;

                    return (
                        <li key={k}>
                            <div className="file-progress">
                                <p>{v.file.name}</p>
                                <Progress value={loaded} max={total} />
                            </div>
                            <div className="description">
                                <p>{toStatus(loaded, total)}</p>
                                <p>{toSpeed(rate, estimated)}</p>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </Modal>
    )
}

export default React.memo(UploadModal);