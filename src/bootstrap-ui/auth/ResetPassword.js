import React, { useRef, useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuthContext } from "../conts/AuthContext";
import { AuthPanelContext } from "../conts/AuthPanelContext";

import { Form, Button, Card, Alert } from "react-bootstrap";

import "./style.css";

export default function ResetPassword() {
    const emailRef = useRef();

    const { resetPassword } = useAuthContext();
    const [authPanelShow, setAuthPanelShow, authStatus, setAuthStatus, formDataPass] =
        useContext(AuthPanelContext);

    const [successStatus, setSuccessStatus] = useState({status: null, message: ''});
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        
        setLoading(true);
        await resetPassword(emailRef.current.value).then(
            () => {
                console.log("firebase password reset mail sent.");
                setSuccessStatus({status: true, message: 'Firebase password reset mail sent.'});
                formDataPass.transition = true;
            },
            (error) => {
                console.log(error.code, error.message);
                setSuccessStatus({status: false, message: 'Failed to send password reset mail!'});
                formDataPass.transition = false;
            }
        );

        setLoading(false);
    }
    let history = useHistory();
    function handleClick(e) {
        e.preventDefault();

        formDataPass.emailPreLogin = emailRef.current.value;
        let path = e.currentTarget.getAttribute("href");

        history.push(path === null ? "/" : path);

        e.stopPropagation();
    }
    useEffect(() => {
        if(formDataPass.transition){
            emailRef.current.value = formDataPass.emailPreLogin;
        }
    });
    return (
            <Card>
                <Card.Body>
                    <h2 className="text-start mb-3">Reset Password</h2>
                    {/* Status message box */}
                    {successStatus.status != null && (
                        <Alert variant={successStatus.status ? 'success' : 'danger' } className={"text-start mb-3 py-2"}>
                            {successStatus.message}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        {/* email form item group */}
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
                        <Button
                            disabled={loading}
                            className="w-100 mt-2"
                            type="submit"
                        >
                            Send Email
                        </Button>
                    </Form>
                    <div className="w-100 mt-2">
                        <p className="text-center mb-0">
                            Go to <Link to="/login" onClick={handleClick}>Log In</Link>
                        </p>
                    </div>
                </Card.Body>
            </Card>
    );
}
