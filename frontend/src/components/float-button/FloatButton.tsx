import "#/css/float-button.css";

type FloatButtonProps = {
    title?: string,
    onClick?: () => void,
    size?: 32 | 48,
    children: React.ReactNode
}

const FloatButton = ({ title, size, onClick, children }: FloatButtonProps) => {
    const sizeSuffix = size ? ` fab--${size}` : "";

    return (
        <button className={"fab" + sizeSuffix}
            title={title}
            onClick={onClick}
        >
            {children}
        </button>
    )

}

export default FloatButton;