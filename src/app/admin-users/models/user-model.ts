import { Achieve } from "./achieve-model"
import { Submit } from "./submit-model";

export class User {

    public constructor(public _id: string, public registration_date: string, public name: string, public last_name: string, public username: string, public email: string, public password: string, public avatar_url: string, public sex: string, public date_birth: string, public country: string, public state: string, public streak_days: number, public type: string, public level: string, public type_institution: string, public achieves: Achieve[], public submits: Submit[], public goal: number, public last_goal: string, public reminder_hour: string){ }

}