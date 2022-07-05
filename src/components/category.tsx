import {CategoryModel} from "../models/categoryModel";
import Game from "./game";

export default function Category(props: CategoryModel) {
    return <section className="category">
        <h2>{props.title}</h2>
        {props.items.map(item => <Game key={props.title+item.title} {...item}/>)}
    </section>
}