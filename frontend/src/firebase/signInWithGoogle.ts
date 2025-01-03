import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const signInWithGoogle = (): Promise<void> => {
    const auth = getAuth();

    auth.languageCode = 'he';
    const provider = new GoogleAuthProvider();

    return new Promise<void>((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential?.accessToken;
                const user = result.user;
                resolve();
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                reject();
            });
    })
}

export default signInWithGoogle;