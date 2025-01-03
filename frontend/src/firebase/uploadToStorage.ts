import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";

const uploadToStorage = async (base64StringURL: string): Promise<string> => {
    const storage = getStorage();
    const auth = getAuth();

    try {
        if (!auth.currentUser || !auth.currentUser?.email) {
            throw ("No user is logged in");
        }

        const storageRef = ref(storage, `${auth.currentUser.email}/${new Date().getTime()}`);

        await uploadString(storageRef, base64StringURL, "data_url");

        console.log("OG URL: " + await getDownloadURL(storageRef))
        return await getDownloadURL(storageRef);
    } catch (e) {
        console.log("Error: " + e);
        alert("Something strange happend. try again")
    }

    return "";
};

export default uploadToStorage;
