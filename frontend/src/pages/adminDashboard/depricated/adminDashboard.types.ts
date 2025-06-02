import { Letters } from "../../../components/letterBox/types.letterBox";
import { FirebaseUserInformation } from "../../register/types.register";

interface UserActivityData {
    createdAt: string;
    dailyTimes: {
        [key: string]: number;
    }
    lastUpdated: string;
    totalActiveTime: number;
    userId: string;
}

type LetterData = {
    total: number;
    correct: number;
    accuracy: number;
    imageUrlArray: string[];
};

type LettersData = {
    [K in Letters]: LetterData;
};

type FirebaseUserInformationData = FirebaseUserInformation;

export type { UserActivityData, LetterData, LettersData, FirebaseUserInformationData };