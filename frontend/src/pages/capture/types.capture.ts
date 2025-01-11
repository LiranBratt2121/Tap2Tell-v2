import { Letters } from "../../components/letterBox/types.letterBox";

type Results = {
    detectedCharacter: Prediction;
    top3: Prediction[];
}

type Prediction = {
    class: Letters;
    class_id: string;
    confidence: string;
}

export type { Results, Prediction };