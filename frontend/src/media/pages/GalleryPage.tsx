import FloatButton from "#/components/float-button/FloatButton";
import Popover from "#/components/popover/Popover";
import { countRender } from "#/debug/countRender";
import { faBars, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { MediaType } from "../api/media.api.response";
import Gallery from "../components/Gallery";
import GalleryCard from "../components/GalleryCard";
import SortOptionDropdown from "../components/SortOptionDropdown";
import UploadArea from "../components/UploadArea";
import "../css/gallery-page.css";
import useMediaCards from "../hooks/useMediaCards";

export default function GalleryPage({ type }: { type: MediaType }) {
    const { mediaCards, sortMode, sortHandler } = useMediaCards(type);
    const [showDescription, setShowDescription] = useState<boolean>(false);
    countRender("GalleryPage");

    return (
        <main id="gallery-page">
            <Gallery>
                {mediaCards.map(media => (
                    <GalleryCard
                        {...media}
                        key={media.id}
                        showDescription={showDescription}
                    />
                ))}
            </Gallery>

            <div className="float-wrap bottom-left">
                <Popover
                    placement="top"
                    trigger={
                        <FloatButton title="정렬">
                            <FontAwesomeIcon icon={faBars} />
                        </FloatButton>
                    }>
                    <SortOptionDropdown
                        {...sortHandler}
                        sortMode={sortMode}
                    />
                </Popover>
            </div>

            <div className="float-wrap bottom-center">
                <FloatButton title="설명 토글" onClick={() => setShowDescription(prev => !prev)}>
                    <FontAwesomeIcon icon={showDescription ? faToggleOn : faToggleOff} />
                </FloatButton>
            </div>

            <UploadArea type={type} />
        </main>
    )
}