import { IsNotEmpty } from "class-validator";

export  class LoginauthenDto{
    @IsNotEmpty()
    loginUser:string;
  
    @IsNotEmpty()
    password:string;

}