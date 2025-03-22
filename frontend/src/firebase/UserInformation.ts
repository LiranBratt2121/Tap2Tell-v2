import { getAuth, User } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { UserInformation, UserRole } from "../pages/register/types.register";

export const fetchUserInformation = async (): Promise<UserInformation | null> => {
    try {
        const auth = getAuth();
        const db = getFirestore();

        if (auth.currentUser) {
            const userDoc = doc(db, 'userInformation', auth.currentUser.uid);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                console.log('User role:', userData.role);
                return userData as UserInformation;
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

export const updateUserInformation = async (userInfo: UserInformation) => {
    const { isFirstLogin: isNewUser, role } = userInfo;
    try {
        const auth = getAuth()
        const db = getFirestore();

        if (auth.currentUser) {
            const userDoc = doc(db, 'userInformation', auth.currentUser.uid);

            if (role === '' || null) {
                await setDoc(userDoc, {
                    isNewUser: isNewUser,
                }, { merge: true });
            } else {
                await setDoc(userDoc, {
                    role: role,
                    isNewUser: isNewUser,
                }, { merge: true });
            }
        }

        return true;
    } catch (error) {
        console.error('Error writing document: ', error);
        return false;
    }
}
