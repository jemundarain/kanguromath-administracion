import { Option } from "../../shared/option-model";
import { Figure } from "./figure-model"

export class Problem {

    public constructor(public _id: string, public statement: string, public solution: string, public category: string, public options: Option[], public figures: Figure[]) {}

}