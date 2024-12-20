import { Letters } from "../components/letterBox/types.letterBox";
import { Results } from "../pages/capture/types.capture";

const askModle = async (storageUrl: string): Promise<Results> => {
    const chosenCharacter: Letters = "Gimel";
    const detectedCharacter: Letters = "Gimel";

    return {
        chosenCharacter: chosenCharacter,
        detectedCharacter: detectedCharacter,
        isRight: chosenCharacter === detectedCharacter
    }
}

export default askModle;