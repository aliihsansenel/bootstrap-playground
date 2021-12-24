import React, { useState } from "react"

import { BrowserRouter as Router } from "react-router-dom"

import store from "./redux/store"
import { Provider } from "react-redux"

import Home from "./pages/Home"

import "./App.css"

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Home />
            </Router>
        </Provider>
    );
}

export default App;
