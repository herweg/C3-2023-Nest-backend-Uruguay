import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountEntity } from '../entities/account.entity';
import { BaseRepository } from './base';
import { AccountRepositoryInterface } from './interfaces';

@Injectable()
export class AccountRepository
    extends BaseRepository<AccountEntity>
    implements AccountRepositoryInterface {

    register(entity: AccountEntity): AccountEntity {
        this.database.push(entity);
        return this.database.at(-1) ?? entity;
    }

    update(id: string, entity: AccountEntity): AccountEntity {
        const indexCurrentEntity = this.database.findIndex(
            (item) => item.id === id && typeof item.deletedAt === 'undefined',
        );
        if (indexCurrentEntity >= 0)
            this.database[indexCurrentEntity] = {
                ...this.database[indexCurrentEntity],
                ...entity,
                id,
            } as AccountEntity;
        else throw new NotFoundException();
        return this.database[indexCurrentEntity];
    }

    delete(id: string, soft?: boolean): void {
        const indexToDelete = this.database.findIndex(
            i => i.id === id &&
            typeof i.deletedAt === 'undefined',
            )
        //const indexToDelete = this.database.indexOf(this.findOneById(id))
        soft ? this.softDelete(indexToDelete) : this.hardDelete(indexToDelete)
    }

    private hardDelete(index: number): void {
        if (index > -1) {
            this.database.
        }
    }

    private softDelete(index: number): void {
        if (index > -1) {
            this.database.splice(index, 1)
        }
    }

    findAll(): AccountEntity[] {
        return this.database.filter(
            (item) => typeof item.deletedAt === 'undefined',
        );
    }

    findOneById(id: string): AccountEntity {
        const currentEntity = this.database.find(
            (item) => item.id === id && typeof item.deletedAt === 'undefined',
        );
        if (currentEntity) return currentEntity;
        else throw new NotFoundException();
    }

    findByState(state: boolean): AccountEntity[] {
        const currentEntity = this.database.find(
            (item) => item.state === state && typeof item.deletedAt === 'undefined',
        )
        if (currentEntity) return currentEntity
        else throw new NotFoundException()
    }

    findByCustomer(customerId: string): AccountEntity[] {
        throw new Error('This method is not implemented');
    }

    findByAccountType(accountTypeId: string): AccountEntity[] {
        throw new Error('This method is not implemented');
    }
}