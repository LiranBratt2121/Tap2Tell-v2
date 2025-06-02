import { Letters } from "../components/letterBox/types.letterBox";

export type FirebaseLetters = {
  [key in Letters]: {
    total: number;
    correct: number;
    accuracy: number;
    imageUrlArray: string[];
  };
};

export type FirebaseUserActivity = {
  userId: string;
  totalActiveTime: number;
  dailyTimes: {
    [date: string]: number;
  };
  lastUpdated: Date;
  createdAt: Date;
};

export type UserRole = "student" | "teacher" | "";

export type FirebaseUserInformation = {
    role: UserRole;
    isFirstLogin: boolean;
};