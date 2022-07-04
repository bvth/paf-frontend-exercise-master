import {useEffect, useState} from "react";
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
        let newContent: CategoryModel[];

        if(category) {
            newContent = content.lists.filter((item: CategoryModel) => item.id === category)
                .map((item: CategoryModel) => ({id: item.id, title: item.title}));
            if(provider)
                newContent.forEach(cat => {
                    let originalCategory = content.lists.find(item => item.id === cat.id)
                    cat.items = originalCategory ? [...originalCategory.items].filter(item => item.provider === provider) : []
                });
            else {
                let filteringProviders = new Set<string>();
                newContent.forEach(cat => {
                    let originalCategory = content.lists.find(item => item.id === cat.id)
                    originalCategory.items.forEach(item => filteringProviders.add(item.provider));
                    cat.items = originalCategory ? [...originalCategory.items] : [];
                });
                setFilteringProviders([...filteringProviders]);
            }
        }
        else {
            setFilteringProviders([]);
            newContent = content.lists;
        }
        setFilteredContent(newContent);
    }

    const onSearch = (searchWord: string) => {
        let newContent: CategoryModel[];

        newContent = content.lists.map((item: CategoryModel) => ({id: item.id, title: item.title}));
        newContent.forEach(cat => {
            cat.items = [...content.lists.find(item => item.id === cat.id).items]
        })
        if(searchWord) {
            newContent.forEach(cat => {
                cat.items = cat.items.filter(item => item.title.toLowerCase().includes(searchWord.toLowerCase()))
            })
        }
        setFilteredContent(newContent);
    }

    return content ?
        <>
            <h1>{content.title}</h1>
            <hr/>
            <p>{content.description}</p>
            <Filter
                categories={filteringCategories}
                providers={filteringProviders}
                onFilter={onFilter}
                onSearch={onSearch}/>
            {filteredContent.map((item: CategoryModel) => <Category key={item.title + item.id} {...item}/>)}
        </>
    : ''
}