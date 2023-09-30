export enum Role
{
    Guest,
    Host,
    Admin
}

export class UserProfile
{
    username:string = "";
    password:string = "";
    name:string = "";
    surname:string = "";
    email:string = "";
    phone:string = "";
    role:Role = Role.Guest;
    photoUrl:string = "";
    isApprovedHost:boolean = false;
}