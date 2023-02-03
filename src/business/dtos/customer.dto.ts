import { IsNumberString, IsUUID, IsAlphanumeric, IsEmail, IsString  } from 'class-validator';

export class CustomerDto{
    
    // @IsUUID(4, { message: "This must be UUID" })
    // id?: string;

    @IsNumberString()
    documentTypeId: string

    @IsString()
    document: string

    @IsString()
    fullName: string

    @IsEmail()
    email: string

    @IsNumberString()
    phone: string

    @IsAlphanumeric()
    password: string
}