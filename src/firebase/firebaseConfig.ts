import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const startFirebase = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyCNumIq9CBBUca36uad2LbZlWn39yIEBO0",
        authDomain: "tap2tellv2.firebaseapp.com",
        projectId: "tap2tellv2",
        storageBucket: "tap2tellv2.firebasestorage.app",
        messagingSenderId: "851751899931",
        appId: "1:851751899931:web:a732908f2ad829904779be",
        measurementId: "G-Q92LLY7WNR"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
}