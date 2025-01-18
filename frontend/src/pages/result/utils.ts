import { Letters } from "../../components/letterBox/types.letterBox";
import { Results } from "../capture/types.capture";
import { additionalAssets } from "../../components/showcaseLetter/utils";

export const isRight = (results: Results | null, trueCharacter: Letters | null): boolean => {
    if (!results) {
        return false;
    }
    
    const top3 = results.top3;

    return top3.some((curr) => curr.class === trueCharacter); 
}

export const playResultSound = (isRight: boolean) => {
    const sound = isRight ? additionalAssets.Success : additionalAssets.Failure;
    const resultAudio = new Audio(sound);
    resultAudio.play();

    return resultAudio;
};

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