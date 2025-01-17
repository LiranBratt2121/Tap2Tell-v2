import { memo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import askModel from "../../firebase/askModel";
import { Results } from "../capture/types.capture";
import { Button, ButtonContainer, CounterText, Header, LetterImage, ResultBody, ResultContainer, ResultImage, SeconderyHeader, WaitGif } from "./styles.result";
import skyConfettiGif from "../../assets/skyconfetti.gif";
import { isRight, playResultSound } from "./utils";
import { Letters } from "../../components/letterBox/types.letterBox";
import { letterAssets } from "../../components/showcaseLetter/utils";

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imgurl = params.get("imgurl") || "";
    const letter = params.get("letter") as Letters || "";

    const Background = memo(() => <WaitGif src={skyConfettiGif} />);

    const [loading, setLoading] = useState(false);
    const [letterCorrect, isLetterCorrect] = useState(false);

    const [_, setResults] = useState<Results | null>(null);
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
                const isLetterRight = isRight(response, letter);
                isLetterCorrect(isLetterRight);

                setTimeout(() => {
                    const resultAudio = playResultSound(isLetterRight);

                    resultAudio.onended = () => {
                        resultAudio.pause()
                        resultAudio.currentTime = 0;
                        resultAudio.remove();
                    };
                }, 300)

                setResults(response);
                console.log(`Results: ${response.top3.map(c => c.class)}`)
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
            <ResultBody>
                <Header>{letterCorrect ? "!כל הכבוד" : "!נסו שוב"}</Header>
                {!letterCorrect && <SeconderyHeader>{"האות הנכונה"}</SeconderyHeader>}
                <LetterImage src={letterAssets[letter].image} />
                <ResultImage src={imgurl} />
            </ResultBody>

            <ButtonContainer>
                <Button onClick={() => navigate("/dashboard")}>חזור</Button>
            </ButtonContainer>
        </ResultContainer>
    );
};

export default Result;
