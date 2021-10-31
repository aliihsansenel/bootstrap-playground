import React, { useState } from "react";

import { BrowserRouter as Router } from "react-router-dom";

import AuthPanelContextProvider from "./conts/AuthPanelContext";

import Home from "./pages/Home";

import "./App.css";

function App() {
    return (
        <AuthPanelContextProvider>
            <Router>
                <Home />
            </Router>
        </AuthPanelContextProvider>
    );
}

export default App;
