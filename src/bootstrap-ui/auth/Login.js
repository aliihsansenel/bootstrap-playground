import React, { useRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import auth from "../firebase";
import { useAuthContext } from "../conts/AuthContext";
import { AuthPanelContext } from "../conts/AuthPanelContext";

import { Form, Button, Card, Alert } from "react-bootstrap";
import Col from "react-bootstrap/Col";

import LogoutButton from "./Logout";

import "./style.css";

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const { login } = useAuthContext();
    const [authPanelShow, setAuthPanelShow, authStatus, setAuthStatus, formDataPass] =
        useContext(AuthPanelContext);

    const [successStatus, setSuccessStatus] = useState({status: null, message: ''});
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
                    {successStatus.status == false && (
                        <Alert variant='danger' className={"text-start mb-3 py-2"}>
                            {successStatus.message}
                        </Alert>
                    )}
                    {authStatus.loggedIn && <LogoutButton />}
                </div>

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
                    <p className="text-end m-0">
                        {/* TODO bu yazıyı başlığın sağına yaslayıp hatalı girişte parlatıp */}
                        <Link
                            className="text-muted"
                            to="/forgot-password"
                            onClick={handleClick}
                        >
                            <small>Forgot Password?</small>
                        </Link>
                    </p>
                    <Button
                        disabled={loading}
                        className="w-100 mt-2"
                        type="submit"
                    >
                        Log In
                    </Button>
                </Form>
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
