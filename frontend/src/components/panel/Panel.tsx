import "#/css/panel.css";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, type LinkProps } from "react-router";

// Base
type PanelItemBase = {
    icon?: IconDefinition,
    label?: string
}

// Root
const Panel = ({ children }: { children: React.ReactNode }) => {
    return (
        <ul className="panel">
            {children}
        </ul>
    )
}

// Button
type PanelButtonProps = PanelItemBase & {
    onClick?: () => void,
}

Panel.Button = ({ icon, label, onClick }: PanelButtonProps) => (
    <li>
        <button className="panel-item" onClick={onClick}>
            {icon && (
                <span className="icon">
                    <FontAwesomeIcon icon={icon} />
                </span>
            )}
            {label && <span className="label">{label}</span>}
        </button>
    </li>
)

// Link
type PanelLinkProps = PanelItemBase & {
    to?: LinkProps["to"],
}

Panel.Link = ({ icon, label, to }: PanelLinkProps) => (
    <li>
        <Link className="panel-item" to={to ?? "#"}>
            {icon && (
                <span className="icon">
                    <FontAwesomeIcon icon={icon} />
                </span>
            )}
            {label && <span className="label">{label}</span>}
        </Link>
    </li>
)

// Anchor

type PanelAnchorProps = PanelItemBase & {
    href?: string
}

Panel.Anchor = ({icon, label, href}: PanelAnchorProps) => (
    <li>
        <a className="panel-item" href={href ?? "#"}>
            {icon && (
                <span className="icon">
                    <FontAwesomeIcon icon={icon} />
                </span>
            )}
            {label && <span className="label">{label}</span>}
        </a>
    </li>
)



export default Panel;