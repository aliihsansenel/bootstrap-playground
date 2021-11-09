import React, { useState, useEffect, useRef } from "react";

import Col, { AddCol } from "./Col";

import plus from "../../../../assets/plus-solid.svg";

import "./style.scss";

export default function Row() {
    const [classes, setClasses] = useState({ layout: ["row", "gx-2", "mb-2"] });
    const classesString = useRef("");

    const [colKeys, setColKeys] = useState([0, 1]);
    const colIdCounter = useRef(1);

    function getClassesString() {
        classesString.current = classes.layout.join(" ");
        return classesString.current;
    }
    function clickHandler(e) {
        setColKeys([...colKeys, ++colIdCounter.current]);
        e.stopPropagation();
    }
    return (
        <div className={getClassesString()}>
            <span className="mb-1" style={{ wordSpacing: "0.3em" }}>
                {"." + classesString.current.replaceAll(" ", " .")}
            </span>
            {colKeys.map((colKeys) => (
                <Col key={colKeys} />
            ))}
            <AddCol clickHandler={clickHandler} />
        </div>
    );
}

function AddRow({ clickHandler }) {
    return (
        <div className="add-row w-100 d-flex justify-content-center text-center mb-2 noselect">
            <div
                className="w-100 d-flex justify-content-center align-items-center"
                onClick={clickHandler}
            >
                <span>Add Row</span>
                <img
                    style={{ height: "1.0em", marginLeft: "0.4em" }}
                    src={plus}
                    alt="Add row"
                />
            </div>
        </div>
    );
}
export { AddRow };
