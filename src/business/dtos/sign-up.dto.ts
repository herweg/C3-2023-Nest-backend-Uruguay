import { IsEmail, IsNumberString, IsUUID, IsString } from 'class-validator';

export class SignUpDto {

    @IsNumberString()
    document: string;

    @IsString()
    fullName: string;

    @IsEmail()
    email: string;

    @IsNumberString()
    phone: string;

    @IsString()
    password: string;

    //@IsUUID(4, { message: "This must be UUID" })
    @IsString()
    accountTypeId: string

    //@IsUUID(4, { message: "This must be UUID" })
    @IsString()
    documentTypeId: string
}