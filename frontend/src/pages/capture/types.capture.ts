import { Letters } from "../../components/letterBox/types.letterBox";

type Prediction = {
    letter: Letters;
    confidence: number;
}

export type { Prediction };