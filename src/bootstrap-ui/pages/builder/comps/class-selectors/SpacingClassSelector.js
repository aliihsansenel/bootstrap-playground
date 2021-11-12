import React, { useState, useEffect, useRef, useContext } from "react";

import { Card } from "react-bootstrap";

import { ClassSelectorContext } from "../../BuilderContainer";
import { breakPointOptions, PageItem, PageItemWithIndex } from "./ClassSelector";

import "./style.scss";

export default function SpacingClassSelector() {
    const { rawClassesData, setClassesState } =
        useContext(ClassSelectorContext);
    // Set for margin or padding?
    const [selectedSpacingType, setSelectedSpacingType] = useState("m");
    const indexMP = ["m", "p"].indexOf(selectedSpacingType);

    // Set for which breakpoint?
    const [selectedBreakPoint, setSelectedBreakPoint] = useState("xs");
    const indexBP = breakPointOptions.indexOf(selectedBreakPoint);
    const [marginValues, setMarginValues] = useState(
        rawClassesData.current.spacing[0]
    );
    const [paddingValues, setPaddingValues] = useState(
        rawClassesData.current.spacing[1]
    );
    // Set for which side or sides top, bottom, left, right? 
    const [selectedSides, setSelectedSides] = useState(Array(4).fill(true));
    const displayedSideValues =
        rawClassesData.current.spacing[indexMP][indexBP];
    const spacingValuesDisabled = false;

    // Spacing options: _ for none, 0, 1, 2, 3, 4, 5 and * for auto
    let spacingOptions = Array.from({ length: 7 }, (_, i) =>
        (i - 1).toString()
    );
    spacingOptions[0] = "_";
    spacingOptions.push("*");
    
    // Switch between spacing types, margin and padding
    function spacingTypeHandler(value) {
        setSelectedSpacingType((prevState) => {
            if (prevState === value) {
                return prevState;
            }
            setSelectedBreakPoint("xs");
            return value;
        });
    }
    // Switch between breakpoints
    function breakPointHandler(value) {
        setSelectedBreakPoint((prevState) =>
            prevState === value ? "xs" : value
        );
    }
    // Toggle sides that will be set 
    function sideHandler(index) {
        setSelectedSides((prevState) => {
            let selectedSides = [...prevState];
            selectedSides[index] = !prevState[index];
            return selectedSides;
        });
    }
    // Every time spacing settings changes, raw data and classes updated
    function spacingValueHandler(value) {
        let newSpacingValues = [];
        const setSpacingValues =
            selectedSpacingType == "m" ? setMarginValues : setPaddingValues;

        setSpacingValues((prevState) => {
            newSpacingValues = [...prevState];
            for (let i = indexBP; i < breakPointOptions.length; i++) {
                let _4 = prevState[i].map((spacingValue, index) => {
                    const newSpacingValue =
                        selectedSides[index] === true ? value : spacingValue;
                    return newSpacingValue;
                });
                newSpacingValues[i] = _4;
            }
            rawClassesData.current.spacing[indexMP] = newSpacingValues;

            return newSpacingValues;
        });
        const unchangedSpacingType = selectedSpacingType === "m" ? "p" : "m";
        setClassesState.current((prevState) => {
            return {
                ...prevState,
                spacing: {
                    [unchangedSpacingType]:
                        prevState.spacing[unchangedSpacingType],
                    [selectedSpacingType]: toSpacingClasses(newSpacingValues),
                },
            };
        });
    }
    // Convert raw spacing data to bootstrap classes like m-2, py-1
    function toSpacingClasses(spacingValues) {
        let spacingClasses = [];
        let lastSpacingValues = ["_", "_", "_", "_"];
        spacingValues.forEach((spacingValues_4, index) => {
            const changedSides = spacingValues_4.map((side, index) => {
                return !(side === lastSpacingValues[index]);
            });
            const verticalSame = spacingValues_4[0] === spacingValues_4[3];
            const horizontalSame = spacingValues_4[1] === spacingValues_4[2];
            const allSame =
                verticalSame &&
                horizontalSame &&
                spacingValues_4[0] === spacingValues_4[1];
            
            let prefix = selectedSpacingType + "?";
            prefix += index === 0 ? "" : "-" + breakPointOptions[index];
            prefix += "-";

            function classPush(index, replaceChar) {
                const value =
                    spacingValues_4[index] === "*"
                        ? "auto"
                        : spacingValues_4[index];
                if (
                    changedSides[index] === true &&
                    spacingValues_4[index] != "_"
                ) {
                    spacingClasses.push(
                        prefix.replace("?", replaceChar) + value
                    );
                    return true;
                }
                return false;
            }
            if (allSame) {
                if (classPush(0, "")) lastSpacingValues = [...spacingValues_4];
                return;
            } else if (horizontalSame) {
                classPush(1, "x");

                if (!verticalSame) {
                    classPush(0, "t");
                    classPush(3, "b");
                    
                    lastSpacingValues = [...spacingValues_4];
                    return;
                }
            }
            if (verticalSame) {
                classPush(0, "y");
                classPush(1, "l");
                classPush(2, "r");

                lastSpacingValues = [...spacingValues_4];
                return;
            }
            classPush(0, "t");
            classPush(1, "l");
            classPush(2, "r");
            classPush(3, "b");

            lastSpacingValues = [...spacingValues_4];
        });
        return spacingClasses;
    }
    return (
        <Card className="class-selector position-absolute start-50 translate-middle-x p-2">
            <Card.Body
                className="spacing-class-selector p-0 d-flex flex-row noselect"
                style={{ width: "auto" }}
            >
                <div
                    className="d-flex flex-column justify-content-between flex-grow-1"
                    style={{ width: "" }}
                >
                    <ul className="pagination mp-selector mb-2">
                        <PageItem
                            text="m"
                            active={"m" === selectedSpacingType}
                            handlerFunction={spacingTypeHandler}
                        />
                        <PageItem
                            text="p"
                            active={"p" === selectedSpacingType}
                            handlerFunction={spacingTypeHandler}
                        />
                    </ul>
                    <ul
                        className="pagination break-point"
                        style={{
                            height: "6rem",
                            maxHeight: "8rem",
                            minWidth: "6rem",
                        }}
                    >
                        {breakPointOptions.map((value, index) => (
                            <div key={index} className="flex-column">
                                <PageItem
                                    text={value}
                                    active={value === selectedBreakPoint}
                                    handlerFunction={breakPointHandler}
                                />
                            </div>
                        ))}
                    </ul>
                </div>
                <ul
                    style={{
                        width: "7rem",
                        height: "8rem",
                    }}
                    className="pagination side-selector flex-shrink-1 m-2 align-self-center"
                >
                    <PageItemWithIndex
                        handlerFunction={sideHandler}
                        index={0}
                        text={displayedSideValues[0]}
                        active={selectedSides[0]}
                    />
                    <PageItemWithIndex
                        handlerFunction={sideHandler}
                        index={1}
                        text={displayedSideValues[1]}
                        active={selectedSides[1]}
                    />
                    <PageItemWithIndex
                        handlerFunction={sideHandler}
                        index={2}
                        text={displayedSideValues[2]}
                        active={selectedSides[2]}
                    />
                    <PageItemWithIndex
                        handlerFunction={sideHandler}
                        index={3}
                        text={displayedSideValues[3]}
                        active={selectedSides[3]}
                    />
                </ul>
                <ul
                    className="pagination col-number m-0"
                    style={{ height: "auto", minWidth: "5rem" }}
                >
                    {spacingOptions.map((value, index) => (
                        <PageItem
                            key={index}
                            text={value}
                            handlerFunction={spacingValueHandler}
                            disabled={spacingValuesDisabled}
                        />
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
}