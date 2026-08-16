import "#/css/popover.css";
import { useEffect, useRef, useState } from "react";

type PopoverPlacement = "top" | "right" | "bottom" | "left"

type PopoverProps = {
    trigger: React.ReactNode,
    placement?: PopoverPlacement,
    children: React.ReactNode,
}
const Popover = ({ trigger, placement, children }: PopoverProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleOutsideClick = (e: MouseEvent) => {
            if (!popoverRef.current?.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);;
    }, [isOpen]);

    return (
        <div ref={popoverRef} className="popover-container">
            <div className="popover-trigger" onClick={() => setIsOpen(prev => !prev)}>
                {trigger}
            </div>
            {isOpen && (
                <div className={`popover ${placement ?? "bottom"}`}>
                    {children}
                </div>
            )}
        </div>
    )
}

export default Popover;