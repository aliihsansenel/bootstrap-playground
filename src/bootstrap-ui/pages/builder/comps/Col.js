import React, { useState, useEffect, useRef } from "react";

export default function Col() {
    const [classes, setClasses] = useState({
        layout: ["col-12", "col-sm-6", "col-lg-4", "mb-2"],
    });

    const classesString = useRef("");

    function getClassesString() {
        classesString.current = classes.layout.join(" ");
        return classesString.current;
    }

    return (
        <div className={getClassesString()}>
            <div>{"." + classesString.current.replaceAll(" ", " .")}</div>
        </div>
    );
}

function AddCol({ clickHandler }) {
    return (
        <div className="add-col w-100 d-flex justify-content-center">
            <div className="col-5 col-md-3 text-center" onClick={clickHandler}>
                <span>Add Column</span>
            </div>
        </div>
    );
}
export { AddCol };
