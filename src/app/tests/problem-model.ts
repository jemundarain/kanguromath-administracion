import { Option } from "./option-model";

export class Problem {

    public constructor(public num_s: number, public statement: string, public solution: string, public type: string, public url_image: string, public category: string, public options: Option[]) {}

}