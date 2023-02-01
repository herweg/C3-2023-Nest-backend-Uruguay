import { IsNotEmpty } from 'class-validator';
import { AccountTypeModel, CustomerModel } from '../../data/models';

export class CreateAccountDto {

    @IsNotEmpty()
    accountTypeId: AccountTypeModel

    @IsNotEmpty()
    customerId: CustomerModel
}