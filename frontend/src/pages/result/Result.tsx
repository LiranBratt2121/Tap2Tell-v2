import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import askModel from "../../firebase/askModel";
import { Results } from "../capture/types.capture";
import { Button, ButtonContainer, CounterText, ResultContainer, WaitGif } from "./styles.result";
import skyConfettiGif from "../../assets/skyconfetti.gif";
import { isRight } from "./utils";
import { Letters } from "../../components/letterBox/types.letterBox";

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imgurl = params.get("imgurl") || "";
    const letter = params.get("letter") as Letters || "";

    const Background = memo(() => <WaitGif src={skyConfettiGif} />);

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Results | null>(null);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCount(prev => prev + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        if (!(letter && imgurl)) {
            alert("No image URL and letter provided!");
            navigate("/dashboard");
            return;
        }

        if (!imgurl) {
            alert("No image URL provided!");
            navigate("/dashboard");
            return;
        }

        if (!letter) {
            alert("No letter provided!");
            navigate("/dashboard");
            return;
        }

        const sendToApi = async () => {
            try {
                setLoading(true);
                const response = await askModel(imgurl);
                setResults(response);
            } catch (e) {
                console.error("An error occurred with the model: ", e);
                alert("Try again");
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };

        sendToApi();
    }, [imgurl, navigate]);

    if (loading) {
        return (
            <>
                <Background />
                <CounterText>{count}</CounterText>
            </>
        );
    }

    return (
        <ResultContainer>
            {isRight(results, letter) ? <p>כל הכבוד!</p> : <p>תנסו שוב!</p>}
            {results ? <p>{JSON.stringify(results)}</p> : <p>No results available</p>}
            <ButtonContainer>
                <Button onClick={() => navigate("/dashboard")}>חזור</Button>
            </ButtonContainer>
        </ResultContainer>
    );
};

export default Result;
