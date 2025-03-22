import { getAuth, signInWithPopup, GoogleAuthProvider, UserCredential } from "firebase/auth";

const signInWithGoogle = (): Promise<UserCredential> => {
    const auth = getAuth();

    auth.languageCode = 'he';
    const provider = new GoogleAuthProvider();

    return new Promise<UserCredential>((resolve, reject) => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential?.accessToken;
                // const user = result.user;
                resolve(result);
            }).catch((result) => {
                // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // The email of the user's account used.
                // const email = error.customData.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                reject(result);
            });
    })
}

export default signInWithGoogle;