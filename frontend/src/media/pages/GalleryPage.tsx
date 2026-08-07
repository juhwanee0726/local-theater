import FloatButton from "#/components/float-button/FloatButton";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { MediaType } from "../api/media.api.response";
import Gallery from "../components/Gallery";
import GalleryCard from "../components/GalleryCard";
import SortOptionDropdown from "../components/SortOptionDropdown";
import UploadArea from "../components/UploadArea";
import "../css/gallery-page.css";
import useMediaCards from "../hooks/useMediaCards";
import { countRender } from "#/debug/countRender";

export default function GalleryPage({ type }: { type: MediaType }) {
    const { mediaCards, sortMode, sortByKey, sortByOrder } = useMediaCards(type);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    const handleMenuToggle = () => setIsMenuOpen(prev => !prev);

    countRender("GalleryPage");

    return (
        <main id="gallery-page">
            <Gallery>
                {mediaCards.map(media => <GalleryCard key={media.id} {...media} />)}
            </Gallery>

            <div className="float-wrap bottom-left">
                {isMenuOpen && (
                    <SortOptionDropdown
                        sortOption={sortMode}
                        onSortByKey={sortByKey}
                        onSortByOrder={sortByOrder}
                    />
                )}
                <FloatButton title="메뉴 열기" onClick={handleMenuToggle}>
                    <FontAwesomeIcon icon={faBars} />
                </FloatButton>
            </div>

            <UploadArea type={type}/>
        </main>
    )
}