import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthenDto {
    @IsEmail()
    email:string;

    @IsNotEmpty()
    username:string;

    @IsNotEmpty()
    password:string;

    @IsNotEmpty()
    avatar:string;
}

