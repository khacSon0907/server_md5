import { IsNotEmpty } from "class-validator";

export class CreateCartDto {
    
    @IsNotEmpty()
    avatar :string;

    @IsNotEmpty()
    name :string;

    @IsNotEmpty()
    price:number;

    @IsNotEmpty()
    quantity:number;

    @IsNotEmpty()
    userId:number

    @IsNotEmpty()
    productId:number;

}
