import {GameModel} from '../models/gameModel';

export default function Game (props: GameModel) {
    return <section className='game'>
        <div className='img-container'>
            <img src={props.image} alt={props.title}/>
        </div>
        <span>{props.title}</span>
    </section>
}