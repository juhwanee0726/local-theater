import "#/css/dropdown.css";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { Link, type LinkProps } from "react-router";

// Root
type DropdownProps = {
    onClose?: () => void,
    children: React.ReactNode

}
const Dropdown = ({ onClose, children }: DropdownProps) => {
    const ref = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!onClose) return;
        const handleClickOutside = (e: MouseEvent) => {
            console.log(e);
            if (!ref.current?.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);;
    }, [onClose]);
    
    return (
        <ul className="dropdown" ref={ref}>
            {children}
        </ul>
    )
}

// ButtonItem
type DropdownButtonItemProps = {
    icon?: IconDefinition,
    iconVisible?: boolean,
    label?: string,
    onClick?: () => void
}

Dropdown.ButtonItem = ({ icon, iconVisible = true, label, onClick }: DropdownButtonItemProps) => (
    <li>
        <button className="dropdown-content" onClick={onClick}>
            <span className="icon">{icon && iconVisible && <FontAwesomeIcon icon={icon} />}</span>
            <span className="label">{label}</span>
        </button>
    </li>

)

// LinkItem
type DropdownLinkItemProps = {
    icon?: IconDefinition,
    to?: LinkProps["to"],
    label?: string
}

Dropdown.AnchorItem = ({ icon, to, label }: DropdownLinkItemProps) => (
    <li>
        <Link className="dropdown-content" to={to ?? "#"}>
            <span className="icon">{icon && <FontAwesomeIcon icon={icon} />}</span>
            <span className="label">{label}</span>
        </Link>
    </li>
)

// Separator
Dropdown.Separator = () => <li className="separator" />

// HeaderItem
Dropdown.HeaderItem = ({ label }: { label: string }) => (
    <li className="header">
        <p>{label}</p>
    </li>
)

export default Dropdown;
