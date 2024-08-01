import { IS_HASH, IsBoolean, IsHash, IsNotEmpty, IsNumber, IsString, MaxLength, isHash } from "class-validator";


export class CreateUserDto {
    // @IsString()
    // @MaxLength(30)
    // @IsNotEmpty()
    // readonly name: string;

    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly email: string;
  
    // @IS_HASH()    //! why it has fucking error
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly password: string;

    @IsNumber()
    // @MaxLength(30)
    // @IsNotEmpty()
    readonly code: number;

    @IsBoolean()
    // @MaxLength(30)
    // @IsNotEmpty()
    readonly usingCode: boolean;

    // @IsNumber()      
    // @IsNotEmpty()
    // readonly roleNumber: number;
    
    // @IsNumber()
    // @IsNotEmpty()
    // readonly class: number;

    // @IsString()
    // @MaxLength(30)
    // @IsNotEmpty()
    // readonly gender: string;

    // @IsNumber()
    // @IsNotEmpty()
    // readonly marks: number;
}