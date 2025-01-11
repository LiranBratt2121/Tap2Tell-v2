import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WaitGif } from "./pages/result/styles.result";
import skyConfettiGif from "./assets/skyconfetti.gif";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });

        return () => unsubscribe();
    }, []);

    if (isAuthenticated === null) {
        return <WaitGif src={skyConfettiGif} />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
