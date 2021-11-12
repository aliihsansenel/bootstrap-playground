import React, { useContext, useState, useEffect } from "react";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signOut,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

// Provides firebase auth functionality.
export default function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    
    async function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            sendEmailVerification(userCredential.user)});
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function updateEmail(email) {
        return updateEmail(auth, email);
    }

    function updatePassword(password) {
        return updatePassword(auth, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
