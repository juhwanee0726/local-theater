import Dropdown from "#/components/dropdown/Dropdown";
import FloatButton from "#/components/float-button/FloatButton";
import Popover from "#/components/popover/Popover";
import { faBars, faToggleOff, faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./debug.dev.css";
import { useState } from "react";

/*

useEffect(() => {
        if (!onClose) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);;
    }, [onClose]);

*/

export default function DebugPage() {
    const [showDescription, setShowDescription] = useState<boolean>(false);
    return (
        <main id="debug-page">
            <Popover trigger={
                <FloatButton title="정렬">
                    <FontAwesomeIcon icon={faBars} />
                </FloatButton>
            }>
                <Dropdown>
                    <Dropdown.HeaderItem label="header" />
                    <Dropdown.ButtonItem label="btn1" />
                    <Dropdown.ButtonItem label="btn2" />
                    <Dropdown.ButtonItem label="btn3" />
                </Dropdown>
            </Popover>

            <div className="float-wrap bottom-center">
                <FloatButton title="설명 토글" onClick={() => setShowDescription(!showDescription)}>
                    <FontAwesomeIcon icon={showDescription ? faToggleOn : faToggleOff} />
                </FloatButton>
            </div>


        </main>
    )

}