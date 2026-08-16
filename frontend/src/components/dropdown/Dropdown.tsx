import "#/css/dropdown.css";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { Link, type LinkProps } from "react-router";

// Root
type DropdownProps = {
    children: React.ReactNode
}
const Dropdown = ({children }: DropdownProps) => {
    const ref = useRef<HTMLUListElement>(null);
    return (
        <ul className="dropdown" ref={ref}>
            {children}
        </ul>
    )
}

// ButtonItem
type DropdownButtonItemProps = {
    icon?: IconDefinition,
    label?: string,
    onClick?: () => void
}

Dropdown.ButtonItem = ({ icon, label, onClick }: DropdownButtonItemProps) => (
    <li>
        <button className="dropdown-content" onClick={onClick}>
            <span className="icon">{icon && <FontAwesomeIcon icon={icon} />}</span>
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
