import { AccountModel } from 'src/data/models';
import { v4 as uuid } from 'uuid';
import { AccountTypeEntity } from './account-type.entity';
import { CustomerEntity } from './customer.entity';

export class AccountEntity implements AccountModel {
    id = uuid()
    customer: CustomerEntity
    accountType: AccountTypeEntity
    balance: number = 0
    state: boolean = true
    deletedAt?: number | Date
}

/*
{
    "id" = uuid(),
    "customer": CustomerEntity,
    "accountType": AccountTypeEntity
}
*/