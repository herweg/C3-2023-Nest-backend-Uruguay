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
    if (!answer) throw new UnauthorizedException()
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
    newCustomer.documentType = this.accountService.getDocumentType(user.documentTypeId)
    newCustomer.document = user.document
    newCustomer.fullName = user.fullName
    newCustomer.email = user.email
    newCustomer.phone = user.phone
    newCustomer.password = user.password

    //this.documentTypeRepo.register(newCustomer.documentType)
    const customer = this.customerRepository.register(newCustomer)

    if (customer === undefined)
      throw new InternalServerErrorException() // ERRORRRRRRRRRRRRRRRR

    //Definiendo la nueva Account
    const accountEnt = new AccountEntity()
    accountEnt.customer = customer
    const acctype = this.accountService.getAccountType(user.accountTypeId)
    accountEnt.accountType = acctype

    const newAccount = new CreateAccountDto()
    newAccount.accountTypeId = accountEnt.accountType.id
    newAccount.customerId = customer.id

    const account = this.accountService.createAccount(newAccount)

    if (account === undefined) throw new InternalServerErrorException() // ERRORRRRRRRRRRRRRRRR
    return jwt.sign(user, process.env.TOKEN_SECRET || "tokentest")
  }

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