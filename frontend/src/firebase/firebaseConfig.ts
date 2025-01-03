import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const startFirebase = () => {
    const firebaseConfig = {
    apiKey: "AIzaSyAMbppAVrauuJ6z-FMozekgv8RhXk-Hp8c",
    authDomain: "tap2-fc536.firebaseapp.com",
    projectId: "tap2-fc536",
    storageBucket: "tap2-fc536.firebasestorage.app",
    messagingSenderId: "225711342177",
    appId: "1:225711342177:web:859830f79e6e64264c2020",
    measurementId: "G-T2Y66T6BMV"
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
}