import React, { useRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import auth from "../firebase";
import { useAuthContext } from "../conts/AuthContext";
import { AuthPanelContext } from "../conts/AuthPanelContext";

import { Form, Button, Card, Alert } from "react-bootstrap";

import "./style.css";

export default function SignUp() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const { signup } = useAuthContext();
    const [
        authPanelShow,
        setAuthPanelShow,
        authStatus,
        setAuthStatus,
        formDataPass,
    ] = useContext(AuthPanelContext);

    const [successStatus, setSuccessStatus] = useState({
        status: null,
        message: "",
    });
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        if (!examinePasswordInputs()) {
            setSuccessStatus({
                status: false,
                message: "Passwords not matching!",
            });
            setLoading(false);
            return false;
        }
        const email = emailRef.current.value;

        await signup(emailRef.current.value, passwordRef.current.value).then(
            () => {
                console.log("firebase signup succeded.");
                setSuccessStatus({
                    status: true,
                    message: "Sign up succeded.",
                });
                formDataPass.emailPreLogin = email;
            },
            (error) => {
                console.log(error.code, error.message);
                setSuccessStatus({
                    status: false,
                    message: "Failed to sign up!",
                });
            }
        );
        passwordRef.current.value = "";
        passwordConfirmRef.current.value = "";
        setLoading(false);
    }
    function examinePasswordInputs() {
        const password = passwordRef.current.value;
        const passwordConf = passwordConfirmRef.current.value;

        if (password.length > 0 && password.localeCompare(passwordConf) === 0) {
            return true;
        }
        return false;
    }
    let history = useHistory();
    function handleClick(e) {
        e.preventDefault();

        formDataPass.transition = true;
        let path = e.currentTarget.getAttribute("href");
        history.push(path === null ? "/" : path);

        e.stopPropagation();
    }
    useEffect(() => {
        if (formDataPass.transition) {
            emailRef.current.value = formDataPass.emailPreLogin;
            formDataPass.transition = false;
        }
    });
    return (
        <Card>
            <Card.Body>
                <div className="d-flex justify-content-between">
                    <h2 className="text-start mb-3">Sign Up</h2>
                    {successStatus.status != null && (
                        <Alert
                            variant={
                                successStatus.status ? "success" : "danger"
                            }
                            className={"text-start mb-3 py-2"}
                        >
                            {successStatus.message}
                        </Alert>
                    )}
                </div>

                <Form onSubmit={handleSubmit}>
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
                            autoComplete="new-password"
                            required
                        />
                    </Form.Group>
                    <Form.Group
                        id="passwordConfirm"
                        className="form-group mb-1"
                    >
                        <Form.Label className="form-label m-0">
                            Password Confirmation
                        </Form.Label>
                        <Form.Control
                            className="py-1"
                            type="password"
                            ref={passwordConfirmRef}
                            autoComplete="new-password"
                            required
                        />
                    </Form.Group>
                    <Button
                        disabled={loading}
                        className="w-100 mt-2"
                        type="submit"
                    >
                        Sign Up
                    </Button>
                </Form>
                <div className="w-100 mt-2">
                    <p className="text-center mb-0">
                        Already have an account?{" "}
                        <Link to="/login" onClick={handleClick}>
                            Log In
                        </Link>
                    </p>
                </div>
            </Card.Body>
        </Card>
    );
}
