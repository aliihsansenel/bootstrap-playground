import React, { useState } from "react";

import { BrowserRouter as Router } from "react-router-dom";

import AuthPanelContextProvider from "./conts/AuthPanelContext";
import AuthProvider from "./conts/AuthContext";

import Home from "./pages/Home";

import "./App.css";

function App() {
    return (
        <AuthPanelContextProvider>
            <AuthProvider>
                <Router>
                    <Home />
                </Router>
            </AuthProvider>
        </AuthPanelContextProvider>
    );
}

export default App;
