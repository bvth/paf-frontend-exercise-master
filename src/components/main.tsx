import React, {useEffect, useState} from "react";
import {CategoryModel} from "../models/categoryModel";
import Category from "./category";
type GameList = {title: string; lists: CategoryModel[]; description: string}
export default function Main() {
    const [content, setContent] = useState<GameList>()

    useEffect(() => {
        fetch(
            '/api/games/lists.json',
            {
                headers : {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(res =>  res.json()).then((resJson: GameList) => {
            setContent(resJson);
        })
    }, [])

    return <>
        {content ? content.lists.map((item: CategoryModel) => <Category key={item.title+item.id} {...item}/>) : ''}
    </>
}