import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";
import { FirebaseUserInformation } from "./interfaces";

export const fetchFirebaseUserInformation = async (): Promise<FirebaseUserInformation | null> => {
    try {
        const auth = getAuth();
        const db = getFirestore();

        if (auth.currentUser) {
            const userDoc = doc(db, 'userInformation', auth.currentUser.uid);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log('User role:', userData.role);
                return userData as FirebaseUserInformation;
            } else {
                console.log('No such document!');
                return null;
            }
        }
    } catch (error) {
        console.error('Error fetching document: ', error);
    }

    return null;
};

export const fetchCollection = async (col: string) => {
    try {
        const db = getFirestore();
        const auth = getAuth();

        if (auth.currentUser) {
            const collectionRef = collection(db, col);
            const querySnapshot = await getDocs(collectionRef);
            return querySnapshot;
        }

        return null
    } catch (error) {
        console.error('Error writing document: ', error);
        return null;
    }
};

export const updateFirebaseUserInformation = async (userInfo: FirebaseUserInformation) => {
    const { isFirstLogin, role } = userInfo;
    console.log('User role:', role);
    console.log('User isFirstLogin:', isFirstLogin);

    try {
        const auth = getAuth()
        const db = getFirestore();

        if (auth.currentUser) {
            const userDoc = doc(db, 'userInformation', auth.currentUser.uid);

            await setDoc(userDoc, {
                isFirstLogin: isFirstLogin,
                role: role || "",
                desiredDisplayLanguage: userInfo.desiredDisplayLanguage || ""
            } as FirebaseUserInformation, { merge: true });
        }

        return true;
    } catch (error) {
        console.error('Error writing document: ', error);
        return false;
    }
};