import React, { useRef, useState, useEffect, useContext } from "react";

import { useAuthContext } from "../conts/AuthContext";
import { AuthPanelContext } from "../conts/AuthPanelContext";
import { Button } from "react-bootstrap";

function LogoutButton() {
    const { logout } = useAuthContext();
    const [authPanelShow, setAuthPanelShow, authStatus, setAuthStatus] =
        useContext(AuthPanelContext);

    const [loading, setLoading] = useState(false);

    async function handleClick(e) {
        e.preventDefault();
        setLoading(true);
        await logout().then(
            () => {
                setAuthStatus({ loggedIn: false, buttonText: 'Login' });
                console.log("firebase log out succeded.");
            },
            (error) => {
                console.log(error.code, error.message);
                // setError("Failed to log out!");
            }
        );

        setLoading(false);
    }
    useEffect(() => {
        return () => {
            setLoading(null);
        }
    }, [loading]);
    return (
        <Button className="my-1" onClick={handleClick} variant="danger" disabled={loading}>
            Log Out
        </Button>
    );
}

export default LogoutButton;
