import React, { useContext, useState, useEffect } from "react";

export const AuthPanelContext = React.createContext();

export default function AuthPanelContextProvider({ children }) {
    // Should auth panel displayed?
    const [authPanelShow, setAuthPanelShow] = useState(false);

    // authStatus provides whether user loggedIn or not and navbar button text
    const [authStatus, setAuthStatus] = useState({loggedIn: false, buttonText: 'Login'});

    // Shared form data among auth panels eg. login, signup
    const formDataPass = {emailPreLogin: null, transition: false};

    return (
        <AuthPanelContext.Provider value={[authPanelShow, setAuthPanelShow, authStatus, setAuthStatus, formDataPass]}>
            {children}
        </AuthPanelContext.Provider>
    );
}