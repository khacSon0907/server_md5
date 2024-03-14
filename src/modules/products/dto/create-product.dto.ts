import { IsNotEmpty } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty()
    avatar: string;
    @IsNotEmpty()
    name: string;
    origin: string  | null ;
    tar: string  | null;
    nicotine: string | null ;
    smell  : string | null ;
    price  : number;

    @IsNotEmpty()
    productId :number;
}
