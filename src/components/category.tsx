import React from "react";
import {CategoryModel} from "../models/categoryModel";
import Game from "./game";

export default function Category(props: CategoryModel) {
    return <>
        <h2>Title: {props.title}</h2>
        <h3>ID: {props.id}</h3>
        {props.items.map(item => <Game key={props.title+item.title} {...item}/>)}
    </>
}