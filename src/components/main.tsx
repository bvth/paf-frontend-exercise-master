import React, {useEffect, useState} from "react";
import {CategoryModel} from "../models/categoryModel";
import Category from "./category";
import Filter from "./filter";
type GameList = {title: string; lists: CategoryModel[]; description: string}
export default function Main() {
    const [content, setContent] = useState<GameList>();
    const [filteredContent, setFilteredContent] = useState<CategoryModel[]>([]);
    const [filteringCategories, setFilteringCategories] = useState<string[]>([]);
    const [filteringProviders, setFilteringProviders] = useState<string[]>([]);


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
            setFilteredContent(resJson.lists);
            setFilteringCategories(resJson.lists.map(item => item.id));
        })
    }, [])

    const onFilter = (category: string, provider: string) => {
        let filteredContent: CategoryModel[];

        if(category) {
            filteredContent = content.lists.filter((item: CategoryModel) => item.id === category)
                .map((item: CategoryModel) => ({id: item.id, title: item.title}));
            if(provider)
                filteredContent.forEach(cat => {
                    let originalCategory = content.lists.find(item => item.id === cat.id)
                    cat.items = originalCategory ? [...originalCategory.items].filter(item => item.provider === provider) : []
                });
            else {
                let filteringProviders = new Set<string>();
                filteredContent.forEach(cat => {
                    let originalCategory = content.lists.find(item => item.id === cat.id)
                    originalCategory.items.forEach(item => filteringProviders.add(item.provider));
                    cat.items = originalCategory ? [...originalCategory.items] : [];
                });
                setFilteringProviders([...filteringProviders]);
            }
        }
        else {
            setFilteringProviders([]);
            filteredContent = content.lists;
        }
        setFilteredContent(filteredContent);
    }

    return content ?
        <>
            <Filter
                categories={filteringCategories}
                providers={filteringProviders}
                onFilter={onFilter}/>
            {filteredContent.map((item: CategoryModel) => <Category key={item.title + item.id} {...item}/>)}
        </>
    : ''
}