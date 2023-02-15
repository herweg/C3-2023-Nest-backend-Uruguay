import { IsNotEmpty } from 'class-validator';

export class CreateAccountDto {

    @IsNotEmpty()
    accountTypeId: string

    @IsNotEmpty()
    customerId: string
}

/**
{
    "accountTypeId":{},
    "customerId":{}
 }
 */