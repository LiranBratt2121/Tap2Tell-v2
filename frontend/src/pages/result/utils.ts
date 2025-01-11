import { Letters } from "../../components/letterBox/types.letterBox";
import { Results } from "../capture/types.capture";

export const isRight = (results: Results | null, trueCharacter: Letters | null) => {
    if (!results) {
        return null;
    }
    
    const top3 = results.top3;

    return top3.some((curr) => curr.class === trueCharacter); 
}