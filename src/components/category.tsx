import {CategoryModel} from '../models/categoryModel';
import Game from './game';

export default function Category(props: CategoryModel) {
    return <section className='category'>
        <h2>{props.title}</h2>
        <div className="flex-container">
            {props.items.map(item => <Game key={props.title+item.title} {...item}/>)}
            {!props.items.length && <p>No result matching your search</p>}
        </div>
    </section>
}