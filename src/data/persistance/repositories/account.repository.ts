import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountEntity } from '../entities';
import { BaseRepository } from './base';
import { AccountRepositoryInterface } from './interfaces';

@Injectable()
export class AccountRepository
    extends BaseRepository<AccountEntity>
    implements AccountRepositoryInterface {

    register(entity: AccountEntity): AccountEntity {
        this.database.push(entity)
        return this.database.at(-1) ?? entity
    }

    update(id: string, entity: AccountEntity): AccountEntity {
        const indexCurrentEntity = this.database.findIndex(
            (item) => item.id === id && typeof item.deletedAt === 'undefined',
        )
        if (indexCurrentEntity >= 0)
            this.database[indexCurrentEntity] = {
                ...this.database[indexCurrentEntity],
                ...entity,
                id,
            } as AccountEntity
        else throw new NotFoundException()
        return this.database[indexCurrentEntity]
    }

    updateBalance(id: string, amount: number): number {
        const account = this.findOneById(id);
        if (!account || typeof account.balance !== 'number')
            throw new Error(`Error updating balance for account with id "${id}"`)
        account.balance += amount
        return account.balance
    }

    delete(id: string, soft?: boolean): void {
        const indexToDelete = this.database.findIndex(
            i => i.id === id &&
                typeof i.deletedAt === 'undefined'
        )
        soft ? this.softDelete(indexToDelete) : this.hardDelete(indexToDelete)
    }

    private softDelete(index: number): void {
        if (index > -1) {
            this.database.find(index => index.deletedAt = new Date)
        }
    }

    private hardDelete(index: number): void {
        if (index > -1) {
            this.database.splice(index, 1)
        }
    }

    findAll(): AccountEntity[] {
        return this.database.filter(
            (item) => typeof item.deletedAt === 'undefined',
        )
    }

    findOneById(id: string): AccountEntity {
        const currentEntity = this.database.findIndex(
            item => item.id === id && typeof item.deletedAt === 'undefined',
        )
        if (currentEntity == -1) throw new NotFoundException()
        return this.database[currentEntity]
    }

    findByState(state: boolean): AccountEntity[] {
        const currentEntity = this.database.filter(
            (item) => item.state === state && typeof item.deletedAt === 'undefined',
        )
        if (currentEntity === undefined) throw new NotFoundException()
        return currentEntity
    }

    findByCustomer(customerId: string): AccountEntity[] {
        const currentEntity = this.database.filter(
            (item) => item.customer.id === customerId && typeof item.deletedAt === 'undefined',
        )
        if (currentEntity === undefined) throw new NotFoundException()
        return currentEntity
    }

    findByAccountType(accountTypeId: string): AccountEntity[] {
        const currentEntity = this.database.filter(
            (item) => item.accountType.id === accountTypeId && typeof item.deletedAt === 'undefined',
        )
        if (currentEntity === undefined) throw new NotFoundException()
        return currentEntity
    }
}