import React, { useState, useEffect, useContext, useRef } from "react";

import plus from "../../../../assets/plus-solid.svg";
import cross from "../../../../assets/times-circle-regular.svg";

import { ClassSelectorContext, buildModes } from "../BuilderContainer";
import { breakPointOptions } from "./class-selectors/ClassSelector";

import "./style.scss";

export default function Col({removeColHandler}) {
    const [classes, setClasses] = useState({
        grid: ["col-12", "col-sm-6", "col-lg-4"],
        spacing: { m: ["mb-2"], p: ["p-1"] },
    });
    const {
        rawClassesData,
        setClassesState,
        setDisplayClassSelector,
        buildMode,
    } = useContext(ClassSelectorContext);
    let rawClasses = useRef({
        grid: ["12", "6", "4", "4", "4", "4"],
        spacing: getDefaultSpacingData(),
    });

    // Sets class selectors target as this column and make class selectors shown
    function clickHandler(e) {
        setDisplayClassSelector((displayClassSelector) => {
            if (!displayClassSelector) {
                setClassesState.current = setClasses;
                rawClassesData.current = rawClasses.current;
                return true;
            }
            return false;
        });
    }

    const classesString = useRef("");
    const allClassesString = useRef("");

    // Generate the class string related to current build mode order to display 
    function getClassesString() {
        switch (buildMode) {
            case buildModes.GRID:
                classesString.current = " " + classes.grid.join(" ");
                break;
            case buildModes.SPACING:
                classesString.current = "";
                if (classes.spacing["m"].length != 0)
                    classesString.current +=
                        " " + classes.spacing["m"].join(" ");
                if (classes.spacing["p"].length != 0)
                    classesString.current +=
                        " " + classes.spacing["p"].join(" ");
                break;
            default:
                classesString.current = " " + classes.grid.join(" ");
                break;
        }
        return classesString.current;
    }
    // Generate the long class string order to make columns as a DOM element have it as a class attribute.
    function getAllClassesString() {
        allClassesString.current = classes.grid.join(" ");
        if (classes.spacing["m"].length != 0)
            allClassesString.current += " " + classes.spacing["m"].join(" ");
        if (classes.spacing["p"].length != 0)
            allClassesString.current += " " + classes.spacing["p"].join(" ");
        return allClassesString.current;
    }
    return (
        <div className={getAllClassesString()} onClick={clickHandler}>
            <div
                className="noselect p-1"
                style={{ wordSpacing: "0.3em", letterSpacing: "0.05em" }}
            >
                {getClassesString().replaceAll(" ", " .")}
                <img
                    onClick={removeColHandler}
                    className="remove-col"
                    src={cross}
                    alt="Remove column"
                />
            </div>
        </div>
    );
}

// Add column to the row
function AddCol({ clickHandler }) {
    return (
        <div className="add-col w-100 d-flex justify-content-center noselect">
            <div
                className="col-5 col-md-3 text-center d-flex justify-content-center align-items-center"
                onClick={clickHandler}
            >
                <span>Add Column</span>
                <img
                    style={{ height: "1.3em", marginLeft: "0.4em" }}
                    src={plus}
                    alt="Add column"
                />
            </div>
        </div>
    );
}
export { AddCol };

// Generate blank raw spacing data
function getBlankSpacingData(sides) {
    const _bp = Array(breakPointOptions.length).fill(sides);
    return _bp;
}

// Fill initital spacing values over initial blank spacing raw data
function getDefaultSpacingData() {
    let marginArray = getBlankSpacingData(["_", "_", "_", "2"]);
    let paddingArray = getBlankSpacingData(["1", "1", "1", "1"]);
    
    return [marginArray, paddingArray];
}
function _getBlankSpacingData() {
    const _4 = Array(4).fill("_");
    const _bp = Array(breakPointOptions.length).fill(_4);
    const _mp = Array(2).fill(_bp);
    return _mp;
}