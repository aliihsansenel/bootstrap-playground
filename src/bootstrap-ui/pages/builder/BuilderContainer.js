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
    // clicked column sets this as its own setClasses state
    const setClassesState = useRef(null);

    // clicked column sets this as its own rawClasses data, bootstrap classes extracted using this data
    const rawClassesData = useRef({ grid: [], spacing: { m: [], p: [] } });

    // Should class selector panel be displayed?
    const [displayClassSelector, setDisplayClassSelector] = useState(false);
    const [buildMode, setBuildMode] = useState(buildModes.GRID);

    // close class selector and the transparent cover that prevents triggering other builder actions
    function closeClassSelector(e) {
        setDisplayClassSelector((displayClassSelector) => {
            if (displayClassSelector && e.target.closest(".cover")) {
                return false;
            } else if(e.target.closest(".remove-col")){
                return false;
            } else {
                return displayClassSelector;
            }
        });
    }
    function switchBuildMode(index) {
        if (buildMode == index) return;
        setDisplayClassSelector(false);
        setBuildMode(index);
    }
    useEffect(() => {
        document.body.addEventListener("click", closeClassSelector);

        return function cleanup() {
            document.body.removeEventListener("click", closeClassSelector);
        };
    });
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
            {/* covers surface of builder when class selectors are displayed so other actions like adding column won't be triggered */}
            {cover && <div className="cover position-absolute" />}
            {rowKeys.map((colKeys) => (
                <Row key={colKeys} />
            ))}
            <AddRow clickHandler={clickHandler} />
        </Container>
    );
}
