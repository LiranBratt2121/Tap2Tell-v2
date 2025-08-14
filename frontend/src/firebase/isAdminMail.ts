import { getAuth } from "firebase/auth";
import { adminMails } from "../pages/adminDashboard/v2/adminDashboard.constants";

export const isAdminMailConnected = (): boolean => {
    const email = getAuth().currentUser?.email;
    if (!email) {
        console.warn("No user is currently authenticated.");
        return false;
    }

    return adminMails.includes(email);
};