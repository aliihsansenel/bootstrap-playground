import React, { useState, useEffect, useRef, useContext } from "react";

import { Card } from "react-bootstrap";

import { ClassSelectorContext, buildModes } from "../../BuilderContainer";
import { breakPointOptions, PageItem } from "./ClassSelector";

import "./style.css";

export default function GridClassSelector() {
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