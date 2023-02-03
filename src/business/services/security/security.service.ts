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
    const documentType = new DocumentTypeEntity()
    documentType.name = user.documentTypeName

    const newCustomer = new CustomerEntity();
    newCustomer.documentType = documentType;
    newCustomer.document = user.document;
    newCustomer.fullName = user.fullName;
    newCustomer.email = user.email;
    newCustomer.phone = user.phone;
    newCustomer.password = user.password;

    const customer = this.customerRepository.register(newCustomer)
    this.documentTypeRepo.register(documentType)

    if (customer === undefined)
      throw new InternalServerErrorException() // ERRORRRRRRRRRRRRRRRR

    //Definiendo una Account Type
    const accountType = new AccountTypeEntity()
    //Definiendo la nueva Account
    const accountEnt = new AccountEntity()
    accountEnt.customer = customer
    accountEnt.accountType = accountType
    accountType.name = user.accountTypeName

    const newAccount = new CreateAccountDto()
    newAccount.accountType = accountType
    newAccount.customer = customer

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
    /**verificar token
     jwt.verify token
      si es igual?
      return deslogueado :) (no hace nada)
     */
  }
}