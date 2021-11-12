import React, { useRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuthContext } from "../conts/AuthContext";
import { AuthPanelContext } from "../conts/AuthPanelContext";

import { Form, Button, Card, Alert } from "react-bootstrap";

import LogoutButton from "./Logout";

import "./style.css";

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    // Provides login function from firebase API. 
    const { login } = useAuthContext();

    /*  formDataPass provides data sharing among auth panels eg. login, signup
        authStatus provides whether user loggedIn or not and navbar button text */
    const [authPanelShow, setAuthPanelShow, authStatus, setAuthStatus, formDataPass] =
        useContext(AuthPanelContext);
    // keeps status of succes and message text
    const [successStatus, setSuccessStatus] = useState({status: null, message: ''});
    // loading state makes login button disabled
    const [loading, setLoading] = useState(false);

    let emailName = "";
    async function handleSubmit(e) {
        e.preventDefault();
        const email = emailRef.current.value;
        console.log(email);
        
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value).then(
            (userCredential) => {
                const user = userCredential.user;
                // the beginning part of email address before domain name.  
                emailName = emailRef.current.value.substr(
                    0,
                    emailRef.current.value.indexOf("@")
                );
                setAuthStatus({ loggedIn: true, buttonText: emailName });
                console.log(
                    "firebase login succeded: email: ",
                    user.email,
                    " emailVerified: ",
                    user.emailVerified
                );
                setSuccessStatus({status: true, message: 'Login succeded.'});
                
            },
            // handle submit error
            (error) => {
                console.log(error.code, error.message);
                emailRef.current.value = email;
                passwordRef.current.value = '';
                setSuccessStatus({status: false, message: 'Failed to login!'});
            }
        );

        setLoading(false);
    }

    let history = useHistory();
    function handleClick(e) {
        e.preventDefault();

        formDataPass.emailPreLogin = emailRef.current.value;
        
        let path = e.currentTarget.getAttribute("href");

        formDataPass.transition = true;
        history.push(path === null ? "/" : path);
        e.stopPropagation();
    }
    // fill out shared form data before the first render
    useEffect(() => {
        if(formDataPass.transition){
            emailRef.current.value = formDataPass.emailPreLogin;
            formDataPass.transition = false;
        }
    });
    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <h2 className="text-start mb-3">Log In</h2>
                    {/* Status message box */}
                    {successStatus.status == false && (
                        <Alert variant='danger' className={"text-start mb-3 py-2"}>
                            {successStatus.message}
                        </Alert>
                    )}
                    {/* Logout button displayed if logged in*/}
                    {authStatus.loggedIn && <LogoutButton />}
                </div>
                {/* email text field */}
                <Form onSubmit={handleSubmit} className="auth-form">
                    <Form.Group id="email" className="form-group mb-1">
                        <Form.Label className="form-label m-0">
                            E-mail
                        </Form.Label>
                        <Form.Control
                            className="py-1"
                            type="email"
                            ref={emailRef}
                            required
                            autoFocus
                        />
                    </Form.Group>
                    {/* password text field */}
                    <Form.Group id="password" className="form-group mb-1">
                        <Form.Label className="form-label m-0">
                            Password
                        </Form.Label>
                        <Form.Control
                            className="py-1"
                            type="password"
                            ref={passwordRef}
                            required
                        />
                    </Form.Group>
                    {/* forgot password */}
                    <p className="text-end m-0">
                        <Link
                            className="text-muted"
                            to="/forgot-password"
                            onClick={handleClick}
                        >
                            <small>Forgot Password?</small>
                        </Link>
                    </p>
                    {/* submit button */}
                    <Button
                        disabled={loading}
                        className="w-100 mt-2"
                        type="submit"
                    >
                        Log In
                    </Button>
                </Form>
                {/* signup link */}
                <div className="w-100 mt-2">
                    <p className="text-center mb-0">
                        Need an account? <Link to="/signup" onClick={handleClick}>Sign Up</Link>
                    </p>
                </div>
            </Card.Body>
        </Card>
    );
}

export default Login;
