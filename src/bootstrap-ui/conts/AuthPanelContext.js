import React, { useContext, useState, useEffect } from "react";

export const AuthPanelContext = React.createContext();

export default function AuthPanelContextProvider({ children }) {
    const [authPanelShow, setAuthPanelShow] = useState(false);
    const [authStatus, setAuthStatus] = useState({loggedIn: false, buttonText: 'Login'});

    const formDataPass = {emailPreLogin: null, transition: false};

    return (
        <AuthPanelContext.Provider value={[authPanelShow, setAuthPanelShow, authStatus, setAuthStatus, formDataPass]}>
            {children}
        </AuthPanelContext.Provider>
    );
}