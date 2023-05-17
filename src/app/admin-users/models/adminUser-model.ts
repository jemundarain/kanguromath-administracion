import { Avatar } from "./avatar-model";

export class AdminUser {

    public constructor(public _id: string, public name: string, public last_name: string, public username: string, public avatar: Avatar, public sex: string, public email: string, public date_birth: Date, public password: string){}

}