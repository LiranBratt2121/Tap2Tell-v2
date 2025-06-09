import { memo, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import askModel from "../../firebase/askModel";
import { Prediction } from "../capture/types.capture";
import { Button, ButtonContainer, CounterText, Header, LetterImage, ResultBody, ResultContainer, ResultImage, SeconderyHeader, WaitGif } from "./styles.result";
import skyConfettiGif from "../../assets/skyconfetti.gif";
import { isRight, playResultSound, playSuccessBellsSound, playWaitSound } from "./utils";
import { Letters } from "../../components/letterBox/types.letterBox";
import { letterAssets } from "../../components/showcaseLetter/assetManger";
import StarBorder from "../../components/border/Border";
import { updateData as updateLetterDataFirebase } from "../../firebase/lettersLogic";
import { isAdminMailConnected } from "../../firebase/isAdminMail";

const Result = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imgurl = params.get("imgurl") || "";
    const letter = params.get("letter") as Letters || "";

    const Background = memo(() => <WaitGif src={skyConfettiGif} />);

    const [loading, setLoading] = useState(false);
    const [letterCorrect, isLetterCorrect] = useState(false);

    const [results, setResults] = useState<Prediction[] | null>(null);
    const [count, setCount] = useState(0);

    const DEBUG = false;

    const imageRef = useRef<HTMLImageElement>(null); // Create ref for ResultImage

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCount(prev => prev + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

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

        let stopWaitSound: () => void = () => { };
        let stopResultSound: () => void = () => { };
        let stopSuccessBellsSound: () => void = () => { };

        const sendToApi = async () => {
            stopWaitSound = playWaitSound();
            try {
                setLoading(true);

                const response: Prediction[] = DEBUG
                    ?
                    [
                        { letter: "Alef", confidence: 0.5325751304626465 },
                        { letter: "Het", confidence: 0.4005211591720581 },
                        { letter: "Qof", confidence: 0.055599428713321686 },
                        { letter: "Bet", confidence: 0.005586538929492235 },
                        { letter: "Zayin", confidence: 0.0029250329826027155 }
                    ]
                    : await askModel(imgurl);
                const isLetterRight = isRight(response, letter);
                updateLetterDataFirebase(letter, isLetterRight, imgurl);
                isLetterCorrect(isLetterRight);

                stopSuccessBellsSound = isLetterRight ? playSuccessBellsSound() : () => { };
                stopResultSound = playResultSound(isLetterRight);

                setResults(response);
                console.log(`Results: ${response.map(i => `${i.letter}: ${i.confidence}`)}`);
            } catch (e) {
                console.error("An error occurred with the model: ", e);
                alert("Try again");
                navigate("/dashboard");
            } finally {
                setLoading(false);
                stopWaitSound();
            }
        };

        sendToApi();

        return () => {
            stopWaitSound();
            stopResultSound();
            stopSuccessBellsSound();
        };
    }, [imgurl, navigate]);

    const navigateToProcessedImage = () => {
        if (imgurl && results) {
            try {
                const encodedImgUrl = encodeURIComponent(imgurl);
                // Stringify the results array to JSON, then encode
                const encodedResults = encodeURIComponent(JSON.stringify(results));
                navigate(`/processedImage?imgurl=${encodedImgUrl}&modelresults=${encodedResults}`);
            } catch (error) {
                console.error("Error encoding data for navigation:", error);
                alert("Could not prepare data for the next page.");
            }
        } else {
            alert("Image URL or model results are not available yet.");
        }
    };

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
                <StarBorder won={letterCorrect}><ResultImage ref={imageRef} src={imgurl} /></StarBorder>
            </ResultBody>

            {isAdminMailConnected() && (
                <ButtonContainer>
                    <Button onClick={navigateToProcessedImage}>ראה תמונה מעובדת</Button>
                </ButtonContainer>
            )}
            <ButtonContainer>
                <Button onClick={() => navigate("/dashboard")}>חזור</Button>
            </ButtonContainer>
        </ResultContainer>
    );
};

export default Result;
