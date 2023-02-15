// Libraries
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
// Data transfer objects
import { CreateAccountDto, SignInDto, SignUpDto } from 'src/business/dtos';
// Repositories & Entities
import {
  AccountEntity, AccountTypeEntity, CustomerEntity,
  CustomerRepository, DocumentTypeEntity
} from 'src/data';
// Services
import { AccountService } from '../account';

// JWT
import * as jwt from "jsonwebtoken"
import { DocumentTypeRepository } from '../../../data/persistance/repositories/document-type.repository';
import { AccountTypeModel, DocumentTypeModel } from 'src/data/models';

const pasaporte: DocumentTypeModel = {
  id: "c5acd2c2-2c37-4444-a151-9d551fee636f",
  state: true,
  name: "Pasaporte"
}

const cedula: DocumentTypeModel = {
  id: "8b946081-5928-464d-928e-bac94fe1800f",
  state: true,
  name: "Cedula"
}

const cajaAhorros: AccountTypeModel = {
  id: "7057c598-a6bf-47db-ad7a-5c5c69119b27",
  state: true,
  name: "Caja de ahorros"
}

const cuentaCorriente: AccountTypeModel = {
  id: "94ff6692-e158-48e8-9e25-6501460653ac",
  state: true,
  name: "Cuenta Corriente"
}

@Injectable()
export class SecurityService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly accountService: AccountService,
    private readonly documentTypeRepo: DocumentTypeRepository
  ) { }
  /**
 * Identificarse en el sistema
 *
 * @param {CustomerModel} user
 * @return {*}  {string}
 * @memberof SecurityService
 */
  signIn(user: SignInDto): string {
    const answer = this.customerRepository.findOneByEmailAndPassword(
      user.email,
      user.password,
    )
    if (!answer) throw new UnauthorizedException("Email or password doesn't match")
    return jwt.sign(user, process.env.TOKEN_SECRET || "tokentest")

  }

  /**
   * Crear usuario en el sistema
   *
   * @param {CustomerModel} user
   * @return {*}  {string}
   * @memberof SecurityService
   */
  signUp(user: SignUpDto): string {

    const newCustomer = new CustomerEntity()

    switch (user.documentTypeId) {
      case "Cedula":
        newCustomer.documentType = cedula
        break

      case "Pasaporte":
        newCustomer.documentType = pasaporte
        break
    }

    newCustomer.document = user.document
    newCustomer.fullName = user.fullName
    newCustomer.email = user.email
    newCustomer.phone = user.phone
    newCustomer.password = user.password

    //this.documentTypeRepo.register(newCustomer.documentType)
    const customer = this.customerRepository.register(newCustomer)

    if (!customer)
      throw new InternalServerErrorException("Error creating a customer")

    //Definiendo la nueva Account
    const accountEnt = new AccountEntity()
    accountEnt.customer = customer
    
    switch (user.accountTypeId) {
      case "Caja de ahorros":
        accountEnt.accountType = cajaAhorros
        break

      case "Cuenta Corriente":
        accountEnt.accountType = cuentaCorriente
        break
    }

    console.log(accountEnt);
    
    const newAccount = new CreateAccountDto()
    newAccount.accountTypeId = accountEnt.accountType.id
    newAccount.customerId = customer.id

    const account = this.accountService.createAccount(newAccount)

    if (!account) throw new InternalServerErrorException("Error creating an account")
    return jwt.sign(user, process.env.TOKEN_SECRET || "tokentest")
  }

  //BACKUP signup
  // signUp(user: SignUpDto): string {

  //   const newCustomer = new CustomerEntity()
  //   newCustomer.documentType = this.accountService.getDocumentType(user.documentTypeId)
  //   newCustomer.document = user.document
  //   newCustomer.fullName = user.fullName
  //   newCustomer.email = user.email
  //   newCustomer.phone = user.phone
  //   newCustomer.password = user.password

  //   //this.documentTypeRepo.register(newCustomer.documentType)
  //   const customer = this.customerRepository.register(newCustomer)

  //   if (customer === undefined)
  //     throw new InternalServerErrorException() // ERRORRRRRRRRRRRRRRRR

  //   //Definiendo la nueva Account
  //   const accountEnt = new AccountEntity()
  //   accountEnt.customer = customer
  //   const acctype = this.accountService.getAccountType(user.accountTypeId)
  //   accountEnt.accountType = acctype

  //   const newAccount = new CreateAccountDto()
  //   newAccount.accountTypeId = accountEnt.accountType.id
  //   newAccount.customerId = customer.id

  //   const account = this.accountService.createAccount(newAccount)

  //   if (account === undefined) throw new InternalServerErrorException() // ERRORRRRRRRRRRRRRRRR
  //   return jwt.sign(user, process.env.TOKEN_SECRET || "tokentest")
  // }

  /**
   * Salir del sistema (Borrar el token (?))
   *
   * @param {string} JWToken
   * @memberof SecurityService
   */
  signOut(JWToken: string): void {
    if (!jwt.verify(JWToken, process.env.TOKEN_SECRET || 'tokentest')) throw new Error('JWT Not Valid')
    console.log('Signout Completed')
  }
}