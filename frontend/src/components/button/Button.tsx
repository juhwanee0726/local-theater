import "#/css/button.css";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ButtonProps = {
    icon?: IconDefinition,
    label?: string,
    title?: string,
    onClick?: () => void,
    color?: "primary" | "secondary" | "tertiary",
    colorType?: "confirm" | "danger",
}

const Button = ({
    icon,
    label,
    title,
    onClick,
    color = "primary",
    colorType
}: ButtonProps) => {
    const className = [
        "btn",
        `btn--${color}`,
        colorType ? `btn--${colorType}` : ""
    ].join(" ");

    return (
        <button
            className={className}
            title={title}
            onClick={onClick}
        >
            {icon && <span className="icon"><FontAwesomeIcon icon={icon} /></span>}
            {label && <span className="label">{label}</span>}
        </button>
    )

}

export default Button;