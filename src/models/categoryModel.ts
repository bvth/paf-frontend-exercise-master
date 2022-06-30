import {GameModel} from "./gameModel";

export interface CategoryModel {
    id: string;
    items: GameModel[];
    title: string;
}