// Libraries
import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ChangeAccountTypeDto, CreateAccountDto } from 'src/business/dtos';

// Repositories & Entities
import { AccountEntity, AccountRepository, AccountTypeEntity, AccountTypeRepository, CustomerEntity, CustomerRepository } from 'src/data';
import { TypeDto } from '../../dtos/type.dto';
import { DocumentTypeEntity } from '../../../data/persistance/entities/document-type.entity';
import { DocumentTypeRepository } from '../../../data/persistance/repositories/document-type.repository';



@Injectable()
export class AccountService {

  constructor(private readonly accountRepository: AccountRepository,
    private readonly accountTypeRepository: AccountTypeRepository,
    private readonly documentTypeRepository: DocumentTypeRepository) { }


  getId(id: string): AccountEntity {
    return this.accountRepository.findOneById(id)
  }

  getAccByCustomer(customerId: string): AccountEntity[] {
    return this.accountRepository.findByCustomer(customerId)
  }
  /**
   * Crear una cuenta
   *
   * @param {AccountModel} account
   * @return {*}  {AccountEntity}
   * @memberof AccountService
   */
  createAccount(account: CreateAccountDto): AccountEntity {
    const newAccount = new AccountEntity()

    const accountType = new AccountTypeEntity();
    accountType.id = account.accountTypeId;
    newAccount.accountType = accountType;

    const customer = new CustomerEntity();
    customer.id = account.customerId;
    newAccount.customer = customer;

    return this.accountRepository.register(newAccount);
  }

  createAccountType(inputName: TypeDto): AccountTypeEntity {
    const newAccountType = new AccountTypeEntity()
    newAccountType.name = inputName.name
    return this.accountTypeRepository.register(newAccountType)
  }

  createDocumentType(inputName: TypeDto): DocumentTypeEntity {
    const newDocumentType = new DocumentTypeEntity()
    newDocumentType.name = inputName.name
    return this.documentTypeRepository.register(newDocumentType)
  }

  /**
   * Obtener el balance de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {number}
   * @memberof AccountService
   */
  getBalance(accountId: string): number {
    return this.getId(accountId).balance
  }

  /**
   * Agregar balance a una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  addBalance(accountId: string, amount: number): number {
    try {
      if (amount > 0) {
        const account = this.getId(accountId)
        account.balance += Number(amount)
        this.accountRepository.update(accountId, account)
      }
      return this.getId(accountId).balance
    }
    catch (error) {
      throw new Error("Error en addBalance" + error)
    }
  }

  /**
   * Remover balance de una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @memberof AccountService
   */
  removeBalance(accountId: string, amount: number): number {
    try {
      if (this.verifyAmountIntoBalance(accountId, amount)) {
        this.accountRepository.updateBalance(accountId, -amount)
      }
      return this.getId(accountId).balance
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Verificar la disponibilidad de un monto a retirar en una cuenta
   *
   * @param {string} accountId
   * @param {number} amount
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  verifyAmountIntoBalance(accountId: string, amount: number): boolean {
    try {
      if (amount > 0 &&
        this.getId(accountId).balance >= amount) {
        return true
      } else return false
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Obtener el estado de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {boolean}
   * @memberof AccountService
   */
  getState(accountId: string): boolean {
    try {
      return this.accountRepository.findOneById(accountId).state
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Cambiar el estado de una cuenta
   *
   * @param {string} accountId
   * @param {boolean} state
   * @memberof AccountService
   */
  changeState(accountId: string, state?: boolean): void {
    try {
      let actualState = this.accountRepository.findOneById(accountId);
      actualState.state = !actualState.state
      this.accountRepository.update(accountId, actualState);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Obtener el tipo de cuenta de una cuenta
   *
   * @param {string} accountId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  getAccountType(accountId: string): AccountTypeEntity {
    try {
      return this.accountTypeRepository.findOneById(accountId)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  getDocumentType(accountId: string): DocumentTypeEntity {
    try {
      return this.documentTypeRepository.findOneById(accountId)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Cambiar el tipo de cuenta a una cuenta
   *
   * @param {string} accountId
   * @param {string} accountTypeId
   * @return {*}  {AccountTypeEntity}
   * @memberof AccountService
   */
  changeAccountType(account: ChangeAccountTypeDto): AccountTypeEntity {
    try {
      const changeType = this.accountRepository.findOneById(account.accountId)
      changeType.accountType = this.accountTypeRepository.findOneById(account.accountTypeId)
      return this.accountRepository.update(account.accountId, changeType).accountType
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Borrar una cuenta
   *
   * @param {string} accountId
   * @memberof AccountService
   */
  deleteAccount(accountId: string, soft?: boolean): void {
    try {
      this.accountRepository.delete(accountId, soft)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  // test
  getAll(): AccountEntity[] {
    try {
      return this.accountRepository.findAll()
    } catch (error) {
      throw new Error("Error en getAll" + error)
    }
  }
}