import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const startFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyBWhPtuek-ATk9lQLTryYMfyywkVjq3eng",
        authDomain: "tap2tell-efadc.firebaseapp.com",
        projectId: "tap2tell-efadc",
        storageBucket: "tap2tell-efadc.firebasestorage.app",
        messagingSenderId: "761719365935",
        appId: "1:761719365935:web:1fdfcba2a0009ba88181da",
        measurementId: "G-ZKNGR5PVGW"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
}