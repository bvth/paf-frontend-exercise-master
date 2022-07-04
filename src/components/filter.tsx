import {ChangeEvent, useEffect, useRef, useState} from "react";

export default function Filter(props: {categories: string[]; providers: string[]; onFilter: Function; onSearch: Function}) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [searchHistory, setSearchHistory] = useState<string[]>([])
    const [showHistory, setShowHistory] = useState<boolean>(false)
    const [searchWord, setSearchWord] = useState<string>('')

    const inputRef = useRef(null);

    useEffect(() => {
        if(localStorage.getItem("searchHistory"))
            setSearchHistory(localStorage.getItem("searchHistory").split(","));
    }, [])

    const setFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        event.preventDefault();
        let {name, value} = event.target;
        if(searchWord) {
            props.onSearch('');
            setSearchWord('');
        }
        if(name === 'category') {
            props.onFilter(value, undefined)
            setSelectedCategory(value);
            setSelectedProvider('');
        } else {
            props.onFilter(selectedCategory, value)
            setSelectedProvider(value)
        }
    }

    const onSearch = (event: Event) => {
        event.preventDefault();
        props.onSearch(inputRef.current.value)
        if(inputRef.current.value) {
            let history = [...searchHistory];
            history.unshift(inputRef.current.value);
            if(history.length > 10)
                history.pop();
            setSearchHistory(history);
            localStorage.setItem("searchHistory", history);
        }
    }

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    }

    const changeInput = (event: Event) => {
        setSearchWord(event.target.value);
    }

    const setSearchWordFromHistory = (event: Event, word: string) => {
        event.stopPropagation();
        setSearchWord(word);
    }

    return <form className="filter-form">
            <div>
                <select name="category" id="category" value={selectedCategory} onChange={setFilter}>
                    <option value="">All categories</option>
                    {props.categories.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
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
            <div>
                <span>OR</span>
            </div>
            <div className="search-container">
                <input
                    autoComplete="off"
                    type="text"
                    name="searchField"
                    ref={inputRef}
                    value={searchWord}
                    onChange={changeInput}
                    onFocus={toggleHistory}
                    onBlur={toggleHistory}/>
                <button onClick={onSearch} type="submit">Search</button>
                {searchHistory.length && showHistory &&
                    <div className="search-history">
                        {searchHistory.map((item, index) =>
                            <div
                                key={item + "_" + index}
                                onMouseDown={(event) => setSearchWordFromHistory(event, item)}>
                                <span>{item}</span>
                            </div>
                        )}
                    </div>
                }
            </div>
        </form>;
}