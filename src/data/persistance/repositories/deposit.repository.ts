import { Injectable, NotFoundException } from "@nestjs/common";
import { DepositEntity } from "../entities";
import { BaseRepository } from "./base";
import { DepositRepositoryInterface } from "./interfaces";
import { PaginationModel } from '../../../../dist/data/models/pagination.model';

@Injectable()
export class DepositRepository
    extends BaseRepository<DepositEntity>
    implements DepositRepositoryInterface {

    register(entity: DepositEntity): DepositEntity {
        try {
            this.database.push(entity)            
            return this.database.at(-1) ?? entity
        
        } catch (error) {
            throw new Error(error)
        }}

    update(id: string, entity: DepositEntity): DepositEntity {
        const indexCurrentEntity = this.database.findIndex(
            (item) => item.id === id && typeof item.deletedAt === 'undefined',
        );
        if (indexCurrentEntity >= 0)
            this.database[indexCurrentEntity] = {
                ...this.database[indexCurrentEntity],
                ...entity,
                id,
            } as DepositEntity;
        else throw new NotFoundException();
        return this.database[indexCurrentEntity];
    }

    delete(id: string, soft?: boolean): void {
        const indexToDelete = this.database.findIndex(
            i => i.id === id &&
                typeof i.deletedAt === 'undefined'
        )
        //const indexToDelete = this.database.indexOf(this.findOneById(id))
        soft ? this.softDelete(indexToDelete) : this.hardDelete(indexToDelete)
    }

    private hardDelete(index: number): void {
        if (index > -1) {
            this.database.splice(index, 1)
        }
    }

    private softDelete(index: number): void {
        if (index > -1) {
            this.database.find(index => index.deletedAt = new Date)
        }
    }

    findAll(): DepositEntity[] {
        return this.database.filter(
            (deposit) => typeof deposit.deletedAt === 'undefined',
        )
    }

    findOneById(id: string): DepositEntity {
        const currentEntity = this.database.findIndex(
            (deposit) => deposit.id === id && typeof deposit.deletedAt === 'undefined',
        );
        if (currentEntity == -1) throw new NotFoundException()
        else return this.database[currentEntity]
    }

    findByAccountId(accountId: string): DepositEntity[] {
        const currentEntity = this.database.filter(
            (deposit) => deposit.account.id === accountId)
        if (!currentEntity) throw new NotFoundException()
        else return currentEntity
    }

    findByDataRange(
        dateInit: Date | number,
        dateEnd: Date | number,
        paginator?: PaginationModel
    ): DepositEntity[] {
        const currentEntity = this.database.filter(
            (deposit) =>
                dateInit > deposit.dateTime
                && deposit.dateTime < dateEnd
                && typeof deposit.deletedAt === "undefined"
        )
        if (!currentEntity) throw new NotFoundException()
        else return currentEntity.slice(Number(paginator?.offset), Number(paginator?.limit))
    }
}