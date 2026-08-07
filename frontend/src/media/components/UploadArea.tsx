import FloatButton from "#/components/float-button/FloatButton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useUpload from "../hooks/useUpload";
import type { MediaType } from "../api/media.api.response";
import { useRef } from "react";
import UploadModal from "./UploadModal";
import { countRender } from "#/debug/countRender";

export default function UploadArea({type}: {type: MediaType}) {
    const { onUpload, progress, isUploading } = useUpload(type);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleUpload = () => inputRef.current?.click();

    countRender("UploadArea");
    return (
        <>
            <div className="float-wrap bottom-right">
                <FloatButton title="파일 업로드" onClick={handleUpload}>
                    <FontAwesomeIcon icon={faPlus} />
                </FloatButton>
            </div>

            {isUploading && <UploadModal progress={progress} />}

            <input
                type="file"
                ref={inputRef}
                multiple
                onChange={onUpload}
                style={{ display: "none" }}
            />
        </>
    )
}