import React, { useState, useEffect, useContext } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,
} from "react-router-dom";
import { Container, Button, Navbar } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { AuthProvider } from "../conts/AuthContext";
import { AuthPanelContext } from "../conts/AuthPanelContext";

import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import ResetPassword from "../auth/ResetPassword";

// import BuilderContainer from "./builder/BuilderContainer";

function Home() {
    const [authPanelShow, setAuthPanelShow, authStatus] =
        useContext(AuthPanelContext);
    let history = useHistory();

    function handleClick(e) {
        if (!authPanelShow) history.push("/login");
        setAuthPanelShow((authPanelShow) => !authPanelShow);
        e.stopPropagation();
    }
    function closeAuthPanel(e) {
        setAuthPanelShow((authPanelShow) => {
            if (authPanelShow && !e.target.closest(".card a, .auth")) {
                return false;
            } else {
                return authPanelShow;
            }
        });
        e.stopPropagation();
    }
    useEffect(() => {
        document.body.addEventListener("click", closeAuthPanel);

        return function cleanup() {
            document.body.removeEventListener("click", closeAuthPanel);
        };
    }, []);

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
                        authStatus.loggedIn && !authPanelShow
                            ? "light"
                            : "primary"
                    }
                >
                    {authStatus.buttonText}
                </Button>
            </Navbar>
            <Row className="justify-content-end">
                <Col sm={8} md={6} lg={4} className="position-absolute">
                    <div className="w-100 ml-auto">
                        <div
                            className={
                                "auth" + (authPanelShow ? "" : " hidden")
                            }
                        >
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
            <Row>
                <h1 className="text-center mb-4">Homepage</h1>
                <div>
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Ullam vitae adipisci aspernatur placeat, velit ut ratione
                    optio, iste, aliquid doloribus sunt quisquam rerum dolor.
                    Necessitatibus sapiente cupiditate vero possimus omnis
                    placeat reiciendis adipisci nobis, veniam consequuntur
                    provident eos. Ea autem eaque placeat illum nihil, illo
                    praesentium aliquam explicabo quibusdam at nemo repellat
                    corrupti deserunt dignissimos culpa perspiciatis asperiores
                    inventore architecto vitae earum libero totam rem
                    consequatur! Dignissimos dolorum unde sequi quos, natus
                    voluptatibus cum nisi, facere deserunt doloribus officia nam
                    quis enim minus, repellat maxime libero? Voluptatem, ducimus
                    molestias excepturi est corporis voluptas eius odit unde
                    laborum? Molestiae, dolorem nesciunt.
                </div>
            </Row>
            <Row>
                {/* <BuilderContainer> 

            </BuilderContainer> */}
            </Row>
        </Container>
    );
}

export default Home;
