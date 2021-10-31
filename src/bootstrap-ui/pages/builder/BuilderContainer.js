import React, { useContext, useState, useEffect, useRef } from "react";

import { Container, Button } from "react-bootstrap";

import Row, { AddRow } from "./comps/Row";
import ClassSelector from "./comps/ClassSelector";

import "./style.css";

export const ClassSelectorContext = React.createContext();

export default function BuilderContainer() {
    const setClassesState = useRef(null);
    const rawClassesData = useRef({ grid: [] });
    const [displayClassSelector, setDisplayClassSelector] = useState(false);

    function closeClassSelector(e) {
        setDisplayClassSelector((displayClassSelector) => {
            if (displayClassSelector && e.target.closest(".cover")) {
                return false;
            } else {
                return displayClassSelector;
            }
        });
    }
    useEffect(() => {
        document.body.addEventListener("click", closeClassSelector);

        return function cleanup() {
            document.body.removeEventListener("click", closeClassSelector);
        };
    }, []);
    return (
        <ClassSelectorContext.Provider
            value={{ rawClassesData, setClassesState, setDisplayClassSelector }}
        >
            {displayClassSelector && <ClassSelector />}
            <BuilderContainerBody cover={displayClassSelector} />
        </ClassSelectorContext.Provider>
    );
}
function BuilderContainerBody({ cover }) {
    const [rowKeys, setRowKeys] = useState([0]);
    const rowIdCounter = useRef(0);

    function clickHandler(e) {
        setRowKeys([...rowKeys, ++rowIdCounter.current]);
    }
    return (
        <Container
            fluid
            className="builder-container position-relative text-center"
        >
            {cover && <div className="cover position-absolute" />}
            {rowKeys.map((colKeys) => (
                <Row key={colKeys} />
            ))}
            <AddRow clickHandler={clickHandler} />
        </Container>
    );
}
