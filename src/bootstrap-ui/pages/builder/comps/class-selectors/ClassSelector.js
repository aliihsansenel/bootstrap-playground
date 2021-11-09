import React, { useState, useEffect, useRef, useContext } from "react";

import { ClassSelectorContext, buildModes } from "../../BuilderContainer";
import GridClassSelector from "./GridClassSelector";
import SpacingClassSelector from "./SpacingClassSelector";

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
export function PageItemWithIndex({ index, text, handlerFunction, active = true }) {
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
export function PageItem({ text, handlerFunction, disabled = false, active = false }) {
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
