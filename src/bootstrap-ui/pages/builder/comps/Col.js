import React, { useState, useEffect, useContext, useRef } from "react";

import plus from "../../../../assets/plus-solid.svg";

import { ClassSelectorContext } from "../BuilderContainer";

import "./style.css";

export default function Col() {
    const [classes, setClasses] = useState({
        grid: ["col-12", "col-sm-6", "col-lg-4"],
        spacing: ["mb-2"],
    });
    const { rawClassesData, setClassesState, setDisplayClassSelector } =
        useContext(ClassSelectorContext);
    let rawClasses = useRef({ grid: ["12", "6", "4", "4", "4", "4"] });
    function clickHandler(e) {
        setDisplayClassSelector((displayClassSelector) => {
            if (!displayClassSelector) {
                setClassesState.current = setClasses;
                rawClassesData.current.grid = rawClasses.current.grid;
                return true;
            }
            return false;
        });
    }
    const classesString = useRef("");

    function getClassesString() {
        classesString.current = classes.grid.join(" ") + " ";
        classesString.current += classes.spacing.join(" ");
        return classesString.current;
    }

    return (
        <div className={getClassesString()} onClick={clickHandler}>
            <div
                className="p-1"
                style={{ wordSpacing: "0.3em", letterSpacing: "0.05em" }}
            >
                {"." + classesString.current.replaceAll(" ", " .")}
            </div>
        </div>
    );
}

function AddCol({ clickHandler }) {
    return (
        <div className="add-col w-100 d-flex justify-content-center">
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
