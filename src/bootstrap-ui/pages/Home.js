import React, { useState, useEffect, useContext } from "react"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom"

import { useSelector, useDispatch } from 'react-redux'

import AuthProvider from "../conts/AuthContext"

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import { Container, Button, Navbar } from "react-bootstrap"

import Login from "../auth/Login"
import SignUp from "../auth/SignUp"
import ResetPassword from "../auth/ResetPassword"

import BuilderContainer from "./builder/BuilderContainer"

import "./style.css"

// Home page
function Home() {
    let history = useHistory();

    const dispatch = useDispatch()
    
    /*  displayPanel indicates whether auth panel should displayed
        authStatus provides whether user loggedIn or not and navbar button text */
    const {displayPanel, authStatus } = useSelector(state => state)

    // Clicking button on navbar displays auth panel
    function handleClick(e) {
        if (!displayPanel) history.push("/login");
        dispatch({type: 'auth/togglePanel'})
        e.stopPropagation();
    }
    // Clicking outside auth panel closes auth panel
    function closeAuthPanel(e) {
        if (displayPanel && !e.target.closest(".card a, .auth")) {
            dispatch({type: 'auth/hidePanel'})
        }
    }
    useEffect(() => {
        document.body.addEventListener("click", closeAuthPanel);

        return function cleanup() {
            document.body.removeEventListener("click", closeAuthPanel);
        };
    }, []);

    // Row and Col components inside return are originated react-bootstrap library
    return (
        <Container fluid>
            <Navbar
                bg=""
                variant="primary"
                className="d-flex justify-content-end"
            >
                <Button
                    onClick={handleClick}
                    variant={
                        authStatus.loggedIn && !displayPanel
                            ? "light"
                            : "primary"
                    }
                >
                    {authStatus.buttonText}
                </Button>
            </Navbar>
            <AuthProvider>
                <Row className="justify-content-end">
                    <Col
                        sm={8}
                        md={6}
                        lg={4}
                        className="auth-container position-absolute"
                    >
                        <div className="w-100 ml-auto">
                            <div
                                className={
                                    "auth" + (displayPanel ? "" : " hidden")
                                }
                            >
                                {/* react-router routing */}
                                <Switch>
                                    <Route path="/login">
                                        <Login />
                                    </Route>
                                    <Route path="/signup">
                                        <SignUp />
                                    </Route>
                                    <Route path="/forgot-password">
                                        <ResetPassword />
                                    </Route>
                                    <Route path="/signout">
                                        <Login />
                                    </Route>
                                    <Route path="/logout">
                                        <Login />
                                    </Route>
                                    <Route path="/">
                                        <Login />
                                    </Route>
                                </Switch>
                            </div>
                        </div>
                    </Col>
                </Row>
            </AuthProvider>
            {/* Websites heading */}
            <Row>
                <h1 className="text-center mb-4">Bootstrap 5 Builder</h1>
            </Row>
            {/* Builder container after websites heading */}
            <Row>
                <BuilderContainer />
            </Row>
        </Container>
    );
}

export default Home;
