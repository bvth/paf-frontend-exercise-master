import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";

export default function Filter(props: {categories: string[]; providers: string[]; onFilter: Function}) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<string>('');

    const setFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        console.log(event.target.name, event.target.value);
        let {name, value} = event.target;
        if(name === 'category') {
            props.onFilter(value, undefined)
            setSelectedCategory(value);
            setSelectedProvider('');
        } else {
            props.onFilter(selectedCategory, value)
            setSelectedProvider(value)
        }
    }

    return <form>
        <div>
            <select name="category" id="category" value={selectedCategory} onChange={setFilter}>
                <option value="">All categories</option>
                {props.categories.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
        </div>
        <div>
            <select
                name="provider"
                id="provider"
                value={selectedProvider}
                onChange={setFilter}
                disabled={!props.providers.length}>
                <option value="">All providers</option>
                {props.providers.map(item => <option key={item} value={item}>{item}</option>)}
            </select>
        </div>
    </form>;
}