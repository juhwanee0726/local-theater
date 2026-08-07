import { useEffect } from "react";
import { useNavigate } from "react-router"

export default function MainPage() {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => { navigate("/videos") }, 1000);
    }, [navigate])

    return (
        <div>
            Not implemented yet.
        </div>
    )
}
