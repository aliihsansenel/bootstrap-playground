import React, { useState, useEffect, useRef, useContext } from "react";

import { Card } from "react-bootstrap";

import { ClassSelectorContext, buildModes } from "../BuilderContainer";

import "./style.css";

export const breakPointOptions = ["xs", "sm", "md", "lg", "xl", "xxl"];

export default function ClassSelector({ buildMode }) {
    function subClassSelector(buildMode) {
        switch (buildMode) {
            case buildModes.GRID:
                return <GridClassSelector />;
            case buildModes.SPACING:
                return <SpacingClassSelector />;
            default:
                return <GridClassSelector />;
        }
    }
    return <div>{subClassSelector(buildMode)}</div>;
}

function GridClassSelector() {
    const { rawClassesData, setClassesState } =
        useContext(ClassSelectorContext);

    let gridSpanOptions = Array.from({ length: 12 }, (_, i) =>
        (i + 1).toString()
    );
    gridSpanOptions.push("*");

    const [selectedBreakPoint, setSelectedBreakPoint] = useState("xs");
    const [gridSpans, setGridSpans] = useState(rawClassesData.current.grid);

    function breakPointHandler(value) {
        setSelectedBreakPoint((prevState) =>
            prevState === value ? "xs" : value
        );
    }
    function gridSpanHandler(value) {
        const index = breakPointOptions.indexOf(selectedBreakPoint);
        let gridSpans = [];
        setGridSpans((prevState) => {
            for (let i = index; i < breakPointOptions.length; i++) {
                prevState[i] = value;
            }
            gridSpans = [...prevState];
            rawClassesData.current.grid = gridSpans;
            return gridSpans;
        });

        setClassesState.current((prevState) => {
            return { ...prevState, grid: toGridClasses(gridSpans) };
        });
    }
    function toGridClasses(gridSpans) {
        let gridClasses = [];
        let lastSpan = "*";

        gridSpans.forEach((gridSpan, index) => {
            if (index == 0) {
                if (gridSpan === "*") gridClasses.push("col");
                else gridClasses.push("col-" + gridSpan);
            } else if (gridSpan != lastSpan) {
                if (gridSpan === "*")
                    gridClasses.push("col-" + breakPointOptions[index]);
                else
                    gridClasses.push(
                        "col-" + breakPointOptions[index] + "-" + gridSpan
                    );
            }
            lastSpan = gridSpan;
        });
        return gridClasses;
    }
    return (
        <Card className="class-selector position-absolute start-50 translate-middle-x d-flex flex-column p-2">
            <Card.Body
                className="grid-class-selector p-0 noselect"
                style={{ width: "30rem" }}
            >
                <ul className="pagination break-point mb-0">
                    {breakPointOptions.map((value, index) => (
                        <div key={index} className="flex-column">
                            <PageItem
                                text={value}
                                active={value === selectedBreakPoint}
                                handlerFunction={breakPointHandler}
                            />
                            <PageItem text={gridSpans[index]} disabled={true} />
                        </div>
                    ))}
                </ul>
                <div className="w-100 seperator m-0 p-0"></div>
                <ul className="pagination col-number m-0">
                    {gridSpanOptions.map((value, index) => (
                        <PageItem
                            key={index}
                            text={value}
                            handlerFunction={gridSpanHandler}
                        />
                    ))}
                </ul>
            </Card.Body>
        </Card>
    );
}
function SpacingClassSelector() {
    const { rawClassesData, setClassesState } =
        useContext(ClassSelectorContext);
    const [selectedSpacingType, setSelectedSpacingType] = useState("m");
    const indexMP = ["m", "p"].indexOf(selectedSpacingType);

    const [selectedBreakPoint, setSelectedBreakPoint] = useState("xs");
    const indexBP = breakPointOptions.indexOf(selectedBreakPoint);
    const [marginValues, setMarginValues] = useState(
        rawClassesData.current.spacing[0]
    );
    const [paddingValues, setPaddingValues] = useState(
        rawClassesData.current.spacing[1]
    );
    const [selectedSides, setSelectedSides] = useState(Array(4).fill(true));
    const displayedSideValues =
        rawClassesData.current.spacing[indexMP][indexBP];
    const spacingValuesDisabled = false;

    let spacingOptions = Array.from({ length: 7 }, (_, i) =>
        (i - 1).toString()
    );
    spacingOptions[0] = "_";
    spacingOptions.push("*");
    function spacingTypeHandler(value) {
        setSelectedSpacingType((prevState) => {
            if (prevState === value) {
                return prevState;
            }
            setSelectedBreakPoint("xs");
            return value;
        });
    }
    function breakPointHandler(value) {
        setSelectedBreakPoint((prevState) =>
            prevState === value ? "xs" : value
        );
    }
    function sideHandler(index) {
        setSelectedSides((prevState) => {
            let selectedSides = [...prevState];
            selectedSides[index] = !prevState[index];
            return selectedSides;
        });
    }
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
function PageItemWithIndex({ index, text, handlerFunction, active = true }) {
    function clickHandler(e) {
        handlerFunction(index);
    }
    return (
        <li
            className={
                "page-item text-center " + (active ? "active" : "disabled")
            }
            style={{ cursor: "pointer" }}
            onClick={clickHandler}
        >
            <a className="page-link">{text}</a>
        </li>
    );
}
function PageItem({ text, handlerFunction, disabled = false, active = false }) {
    function clickHandler(e) {
        handlerFunction(text);
    }
    return !disabled ? (
        <li
            className={"page-item text-center" + (!active ? "" : " active")}
            onClick={clickHandler}
        >
            <a className="page-link">{text}</a>
        </li>
    ) : (
        <li className="page-item disabled" style={{ cursor: "default" }}>
            <a
                className="page-link text-center text-muted"
                tabIndex="-1"
                aria-disabled="true"
            >
                {text}
            </a>
        </li>
    );
}
