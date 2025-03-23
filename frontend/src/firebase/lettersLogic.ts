import { getAuth } from "firebase/auth";
import { Letters } from "../components/letterBox/types.letterBox";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { LetterData } from "../pages/adminDashboard/adminDashboard.types";



export const updateData = async (letter: Letters, isRight: boolean, currentImgUrl: string) => {
    try {
        const auth = getAuth();
        const db = getFirestore();

        if (auth.currentUser) {
            const userDoc = doc(db, 'letters', auth.currentUser.uid);
            const docSnap = await getDoc(userDoc);

            let letterData: LetterData = { total: 0, correct: 0, accuracy: 0, imageUrlArray: [currentImgUrl] };

            if (docSnap.exists()) {
                const userData = docSnap.data();
                letterData = userData[letter] as LetterData || letterData; // Use existing data or initialize
            }

            const total = letterData.total + 1;
            const correct = isRight ? letterData.correct + 1 : letterData.correct;
            const accuracy = (correct / total) * 100;

            let imageUrlArray = letterData.imageUrlArray.length !== 1 // If the total is 1, the array only have the current image url.
                ? [...letterData.imageUrlArray, currentImgUrl]
                : letterData.imageUrlArray;

            // Limit the array length to 5000 to combat the 1mb limit of a doc in firestore.
            // The max limit can be increased by around a thousand (each url is 171 chars) or so, but it's better to keep it safe.
            if (imageUrlArray.length > 5000) {
                imageUrlArray = imageUrlArray.slice(imageUrlArray.length - 5000);
            }

            await setDoc(userDoc, {
                [letter]: {
                    total: total,
                    correct: correct,
                    accuracy: accuracy,
                    imageUrlArray: imageUrlArray
                }
            }, { merge: true });
        }
    } catch (error) {
        console.error('Error fetching document: ', error);
    }
};