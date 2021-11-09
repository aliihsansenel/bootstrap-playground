import React, { useContext, useState, useEffect, useRef } from "react";

import { Container, Button } from "react-bootstrap";

import Row, { AddRow } from "./comps/Row";
import ClassSelector from "./comps/class-selectors/ClassSelector";
import BuildModeNav from "./comps/BuildModeNav";

import "./style.scss";

export const ClassSelectorContext = React.createContext();

export const buildModes = {
    GRID: 0,
    SPACING: 1,
};

export default function BuilderContainer() {
    const setClassesState = useRef(null);
    const rawClassesData = useRef({ grid: [], spacing: {m : [], p : []}});
    const [displayClassSelector, setDisplayClassSelector] = useState(false);
    const [buildMode, setBuildMode] = useState(buildModes.GRID);

    function closeClassSelector(e) {
        setDisplayClassSelector((displayClassSelector) => {
            if (displayClassSelector && e.target.closest(".cover")) {
                return false;
            } else {
                return displayClassSelector;
            }
        });
    }
    function switchBuildMode(index) {
        if(buildMode == index) return;
        setDisplayClassSelector(false);
        setBuildMode(index);
    }
    useEffect(() => {
        document.body.addEventListener("click", closeClassSelector);

        return function cleanup() {
            document.body.removeEventListener("click", closeClassSelector);
        };
    }, []);
    return (
        <ClassSelectorContext.Provider
            value={{
                rawClassesData,
                setClassesState,
                setDisplayClassSelector,
                buildMode,
            }}
        >
            <BuildModeNav buildMode={{ buildMode, switchBuildMode }} />
            {displayClassSelector && <ClassSelector buildMode={buildMode} />}
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
