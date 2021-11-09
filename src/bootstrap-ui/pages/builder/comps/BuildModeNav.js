import React from "react";

const buildModeTexts = ["Grid", "Spacing"];

export default function BuildModeNav(props) {
    const { buildMode, switchBuildMode } = props.buildMode;

    function clickHandler(index) {
        switchBuildMode(index);
    }
    return (
        <div>
            <ul className="build-mode-nav noselect m-0 p-0">
                {buildModeTexts.map((text, index) => {
                    return (
                        <li
                            key={index}
                            className={
                                "px-2 py-1" + (index == buildMode ? " active" : "")
                            }
                            onClick={() => clickHandler(index)}
                        >
                            {text}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}