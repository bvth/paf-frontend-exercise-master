import {useEffect, useState} from 'react';
import {CategoryModel} from '../models/categoryModel';
import Category from './category';
import Filter from './filter';

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
        ).then(res => {
            if(!res.ok)
                throw new Error('Something went wrong');
            return res.json()
        }).then((resJson: GameList) => {
            setContent(resJson);
            setFilteredContent(resJson.lists);
            setFilteringCategories(resJson.lists.map(item => item.id));
            let newFilteringProviders = new Set<string>();
            resJson.lists.forEach(cat => {
                cat.items?.forEach(item => {newFilteringProviders.add(item.provider)});
            })
            setFilteringProviders([...newFilteringProviders]);
        }).catch((error: Error) => {
            console.error(error);
        })
    }, [])

    const filterContent = (type: string, value: string, currentFilteringProvider?: string, searchWord?: string) => {
        let newContent: CategoryModel[] = [];
        if(type === 'category') {
            newContent = deepCopyContent(content.lists);
            if(value) {
                newContent = newContent.filter(cat => cat.id === value);
            }
            //considering current filtered providers
            currentFilteringProvider && newContent.forEach(cat => {
                const {items} = content.lists.find(item => item.id === cat.id);
                cat.items = [...items.filter(item => item.provider === currentFilteringProvider)];
            })
        }
        if(type === 'provider'){
            newContent = deepCopyContent(filteredContent);
            newContent.forEach(cat => {
                const {items} = content.lists.find(item => item.id === cat.id);
                if(value) {
                    cat.items = [...items.filter(item => item.provider === value)];
                }
                else {
                    cat.items = [...items];
                }
            })
        }
        if(searchWord) {
            newContent.forEach(cat => {
                cat.items = cat.items.filter(item => item.title.toLowerCase().includes(searchWord.toLowerCase()))
            })
        }
        setFilteredContent(newContent);
    }

    const deepCopyContent = (input: CategoryModel[]):CategoryModel[] => {
        let newContent: CategoryModel[];

        newContent = input.map((item: CategoryModel) => ({id: item.id, title: item.title}));
        newContent.forEach(cat => {
            cat.items = [...input.find(item => item.id === cat.id).items]
        })
        return newContent
    }

    return content ?
        <>
            <header>
                <h1>{content.title}</h1>
                <hr/>
            </header>
            <main>
                <p>{content.description}</p>
                <Filter
                    categories={filteringCategories}
                    providers={filteringProviders}
                    onFilter={filterContent}/>
                {filteredContent.map((item: CategoryModel) => <Category key={item.title + item.id} {...item}/>)}
            </main>
        </>
    : ''
}