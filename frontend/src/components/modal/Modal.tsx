import "#/css/modal.css";

type ModalProps = {
    onClose?: () => void,
    children: React.ReactNode
}

const Modal = ({onClose, children}: ModalProps) => (
    <div className="modal-overlay" onClick={onClose}>
        <section className="modal-container" onClick={e => e.stopPropagation()}>
            {children}
        </section>
    </div>
)


Modal.Header = ({text}: {text: string}) => (
    <div className="modal-header">
        <h3>{text}</h3>
    </div>
)

Modal.Content = ({children}: {children: React.ReactNode}) => (
    <div className="modal-content">
        {children}
    </div>
)


Modal.Action = ({children}: {children: React.ReactNode}) => (
    <div className="modal-action">
        {children}
    </div>
)

export default Modal;