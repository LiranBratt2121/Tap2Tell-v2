import { Letters } from "../../components/letterBox/types.letterBox";
import { Prediction } from "../capture/types.capture";
import { additionalAssets } from "../../components/showcaseLetter/assetManger";
import { similarHebrewLetters } from "../processedImage/utils";
import i18n from 'i18next';

export const isRight = (results: Prediction[] | null, trueCharacter: Letters | null): boolean => {
    if (!results || !trueCharacter) {
        return false;
    }

    const top5 = results.slice(0, 5);
    const top3 = top5.slice(0, 3);
    const threshold = 0.2;

    const similarLetters = new Set([
        trueCharacter,
        ...(similarHebrewLetters[trueCharacter] || []),
    ]);

    const maxConfidence = Math.max(...top3.map((curr) => curr.confidence));

    // Prioritize similar-looking letters in the top 3 (including exact match)
    const top3HasSimilar = top3.some(
        (curr) =>
            similarLetters.has(curr.letter) &&
            (maxConfidence - curr.confidence) <= threshold
    );

    if (top3HasSimilar) {
        return true;
    }

    // If not in top3, still allow if exact letter appears anywhere in top 5
    const top5HasExact = top5.some((curr) => curr.letter === trueCharacter);

    return top5HasExact;
};


export const playResultSound = (isRight: boolean) => {
    const lng = i18n.language;

    const _additionalAssets = lng === 'he' ? {
        Success: additionalAssets.Success,
        Failure: additionalAssets.Failure,
        SuccessBells: additionalAssets.SuccessBells,
        Counter: additionalAssets.Counter,
    } : lng == 'en' ? {
        Success: additionalAssets.SuccessEnglish,
        Failure: additionalAssets.FailureEnglish,
        SuccessBells: additionalAssets.SuccessBells,
        Counter: additionalAssets.Counter,
    } : {
        ...additionalAssets // Default to Hebrew if no match
    };

    const sound = isRight ? _additionalAssets.Success : _additionalAssets.Failure;

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