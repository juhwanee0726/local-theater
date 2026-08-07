import "#/css/progress.css";

type ProgressProps = {
    value?: number,
    max?: number
}

export default function Progress({ value, max }: ProgressProps) {
    const percentage = value && max && `${value/max*100}%`;
    return (
        <div className="progress-bar">
            <div className="value" style={{width: percentage}} />
        </div>
    )
}