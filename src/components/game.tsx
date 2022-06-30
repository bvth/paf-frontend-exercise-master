import React from "react";
import {GameModel} from "../models/gameModel";

export default function Game (props: GameModel) {
    return <>
        <img src={props.image} alt={props.title}/>
        <h3>ID {props.id}: {props.title}</h3>
        <p><b>Provider:</b>{props.provider}</p>
        <p></p>
    </>
}