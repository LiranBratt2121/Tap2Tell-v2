import { Letters } from "../../components/letterBox/types.letterBox";
import { Prediction } from "../capture/types.capture";
import { additionalAssets } from "../../components/showcaseLetter/assetManger";

export const isRight = (results: Prediction[] | null, trueCharacter: Letters | null): boolean => {
    if (!results || !trueCharacter) {
        return false;
    }

    const top5 = results.slice(0, 5);
    const top3 = top5.slice(0, 3);

    const trueCharPrediction = top5.find((curr) => curr.letter === trueCharacter);
    if (!trueCharPrediction) {
        return false;
    }

    const maxConfidence = Math.max(...top3.map((curr) => curr.confidence));
    const threshold = 0.2; // The larger the more lean with the detection.

    return top3.some((curr) => curr.letter === trueCharacter && (maxConfidence - curr.confidence) <= threshold);
}

export const playResultSound = (isRight: boolean) => {
    const sound = isRight ? additionalAssets.Success : additionalAssets.Failure;

    const resultAudio = new Audio(sound);
    resultAudio.play();

    const stop = () => {
        resultAudio.pause();
        resultAudio.currentTime = 0;
        resultAudio.remove();
    };

    resultAudio.onended = () => {
        stop();
    };

    return stop;
};

export const playSuccessBellsSound = () => {
    const audio = new Audio(additionalAssets.SuccessBells);
    audio.play();

    const stop = () => {
        audio.pause();
        audio.currentTime = 0;
        audio.remove();
    };

    audio.onended = () => {
        stop();
    }

    return stop;
}


export const playWaitSound = () => {
    const sound = additionalAssets.Counter;
    const waitAudio = new Audio(sound);
    waitAudio.loop = true;

    waitAudio.play()

    const stop = () => {
        waitAudio.pause();
        waitAudio.currentTime = 0;
        waitAudio.remove();
    };

    return stop;
}