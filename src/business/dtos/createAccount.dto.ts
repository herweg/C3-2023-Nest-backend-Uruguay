import { IsNotEmpty } from 'class-validator';
import { AccountTypeModel, CustomerModel } from '../../data/models';

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