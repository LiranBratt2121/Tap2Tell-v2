import { useLocation } from "react-router-dom"

const Result = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imgurl = params.get("imgurl") || "";

    return (
        <img src={imgurl} alt="captured" />
    )
}

export default Result
