import React, { useRef, useState, useEffect, useContext } from "react"

import { useAuthContext } from "../conts/AuthContext"
import { useSelector, useDispatch } from 'react-redux'
import { Button } from "react-bootstrap"

function LogoutButton() {
    // Provides logout function from firebase API. 
    const { logout } = useAuthContext();

    // authStatus provides whether user loggedIn or not and navbar button text
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false);

    async function handleClick(e) {
        e.preventDefault();
        setLoading(true);
        await logout().then(
            () => {
                dispatch({ type: 'auth/setStatus', payload: { loggedIn: false, buttonText: 'Login' } })
                console.log("firebase log out succeded.");
            },
            (error) => {
                console.log(error.code, error.message);
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
