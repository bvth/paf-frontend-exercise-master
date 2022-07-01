import React from "react";
import {GameModel} from "../models/gameModel";

export default function Game (props: GameModel) {
    return <div className="game">
        <img src={props.image} alt={props.title}/>
        <span>{props.provider}</span>
    </div>
}