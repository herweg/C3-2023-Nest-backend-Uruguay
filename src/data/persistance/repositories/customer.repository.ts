import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from '../entities';
import { BaseRepository } from './base';
import { CustomerRepositoryInterface } from './interfaces';

@Injectable()
export class CustomerRepository
  extends BaseRepository<CustomerEntity>
  implements CustomerRepositoryInterface {

  register(entity: CustomerEntity): CustomerEntity {
    this.database.push(entity);
    return this.database.at(-1) ?? entity;
  }

  update(id: string, entity: CustomerEntity): CustomerEntity {
    const indexCurrentEntity = this.database.findIndex(item => {
      item.id === id && typeof item.deletedAt === 'undefined'
    })
    if (indexCurrentEntity == -1)
      throw new NotFoundException("customer.repository.update")
    this.database[indexCurrentEntity] = {
      ...this.database[indexCurrentEntity],
      ...entity,
      id,
    } as CustomerEntity
    return this.database[indexCurrentEntity]
  }

  delete(id: string, soft?: boolean | undefined): void {
    const indexToDelete = this.database.findIndex(i => i.id === id)
    this.database.splice(indexToDelete, 1)
  }

  findAll(): CustomerEntity[] {
    return this.database.filter(
      (item) => typeof item.deletedAt === 'undefined',
    );
  }

  findOneById(id: string): CustomerEntity {
    const currentEntity = this.database.findIndex(
      (item) => item.id === id
        && typeof item.deletedAt === 'undefined',
    );
    if (currentEntity == -1) throw new NotFoundException()
    return this.database[currentEntity]
  }

  findOneByEmailAndPassword(email: string, password: string): boolean {
    const indexCurrentEntity = this.database.findIndex(
      (item) => item.email === email
        && item.password === password
        && typeof item.deletedAt === 'undefined',
    );
    return indexCurrentEntity > -1 ? true : false;
  }

  findOneByDocumentTypeAndDocument(
    documentTypeId: string,
    document: string,
  ): CustomerEntity {
    const currentEntity = this.database.findIndex(
      (item) => item.documentType.id === documentTypeId
        && item.document === document
        && typeof item.deletedAt === 'undefined',
    );
    if (currentEntity == -1) throw new NotFoundException()
    return this.database[currentEntity]
  }

  findOneByEmail(email: string): CustomerEntity {
    const currentEntity = this.database.find(
      (item) => item.email === email
        && typeof item.deletedAt === 'undefined',
    );
    if (!currentEntity) throw new NotFoundException()
    return currentEntity
  }

  checkByEmail(email: string): boolean {
    const indexCurrentEntity = this.database.findIndex(
      (item) => item.email === email
        && typeof item.deletedAt === 'undefined',
    );
    return indexCurrentEntity > -1 ? true : false;
  }

  findOneByPhone(phone: string): CustomerEntity {
    const currentEntity = this.database.findIndex(
      (item) => item.phone === phone
        && typeof item.deletedAt === 'undefined',
    );
    if (currentEntity == -1) throw new NotFoundException()
    return this.database[currentEntity]
  }

  findByState(state: boolean): CustomerEntity[] {
    const currentEntity = this.database.filter(
      (item) => item.state === state
        && typeof item.deletedAt === 'undefined',
    )
    if (!currentEntity) throw new NotFoundException()
    else return currentEntity
  }

  findByFullName(fullName: string): CustomerEntity[] {
    const currentEntity = this.database.filter(
      (item) => item.fullName === fullName
        && typeof item.deletedAt === 'undefined',
    )
    if (!currentEntity) throw new NotFoundException()
    else return currentEntity
  }
}