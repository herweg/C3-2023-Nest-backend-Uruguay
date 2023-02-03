import { IsNotEmpty } from 'class-validator';
import { AccountTypeModel, CustomerModel } from '../../data/models';

export class CreateAccountDto {

    @IsNotEmpty()
    accountType: AccountTypeModel

    @IsNotEmpty()
    customer: CustomerModel
}

/**
{
    "accountTypeId":{},
    "customerId":{}
 }
 */