import React, { useState, useEffect, useRef } from "react";

import { Container, Button } from "react-bootstrap";

import Row, {AddRow} from "./comps/Row";

import "./style.css";

export default function BuilderContainer() {

    const [rowKeys, setRowKeys] = useState([0]);
    const rowIdCounter = useRef(0);

    function clickHandler(e) {
        setRowKeys([...rowKeys, ++rowIdCounter.current]);
        e.stopPropagation();
    }
    return (
        <Container fluid className="builder-container text-center">
            {rowKeys.map((colKeys) => (
                <Row key={colKeys} />
            ))}
            <AddRow clickHandler={clickHandler} />
        </Container>
    );
}
