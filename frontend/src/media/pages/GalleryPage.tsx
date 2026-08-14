import FloatButton from "#/components/float-button/FloatButton";
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
    const [sortOption, setSortOption] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState<boolean>(false);

    const handleCloseSortOption = () => setSortOption(false);
    const handleToggleSortOption = () => setSortOption(prev => !prev);
    const handleToggleDescription = () => setShowDescription(prev => !prev);

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
                {sortOption && (
                    <SortOptionDropdown
                        {...sortHandler}
                        sortMode={sortMode}
                        onClose={handleCloseSortOption}
                    />
                )}
                <FloatButton title="정렬" onClick={handleToggleSortOption}>
                    <FontAwesomeIcon icon={faBars} />
                </FloatButton>
            </div>

            <div className="float-wrap bottom-center">
                <FloatButton title="설명 토글" onClick={handleToggleDescription}>
                    <FontAwesomeIcon icon={showDescription ? faToggleOn : faToggleOff} />
                </FloatButton>

            </div>

            <UploadArea type={type} />
        </main>
    )
}