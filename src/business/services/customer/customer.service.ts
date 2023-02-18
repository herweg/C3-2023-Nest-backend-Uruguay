import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomerEntity, CustomerRepository } from 'src/data';
import { CustomerDto } from 'src/business/dtos';
import { DocumentTypeEntity } from '../../../data/persistance/entities/document-type.entity';

@Injectable()
export class CustomerService {

  constructor(private readonly customerRepository: CustomerRepository) { }

  /**
   * Obtener información de un cliente
   *
   * @param {string} customerId
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  getCustomerInfo(customerId: string): CustomerEntity {
    try {
      return this.customerRepository.findOneById(customerId)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  /**
   * Actualizar información de un cliente
   *
   * @param {string} id
   * @param {CustomerModel} customer
   * @return {*}  {CustomerEntity}
   * @memberof CustomerService
   */
  updatedCustomer(id: string, customer: CustomerDto): CustomerEntity {

    let newDTEntity = new DocumentTypeEntity()
    newDTEntity.name = customer.documentTypeId

    let updatedCustomer = this.customerRepository.findOneById(id)
    updatedCustomer.documentType = newDTEntity
    updatedCustomer.document = customer.document
    updatedCustomer.fullName = customer.fullName
    updatedCustomer.email = customer.email
    updatedCustomer.phone = customer.phone
    updatedCustomer.password = customer.password

    return this.customerRepository.update(id, updatedCustomer)
  }

  /**
   * Dar de baja a un cliente en el sistema
   *
   * @param {string} id
   * @return {*}  {boolean}
   * @memberof CustomerService
   */
  unsubscribe(id: string): boolean {
    try {
      const newClient = this.customerRepository.findOneById(id)
      newClient.state = false
      this.customerRepository.update(id, newClient)
      return true
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  getAll(): CustomerEntity[] {
    try {
      return this.customerRepository.findAll()
    } catch (error) {
      throw new Error("Error en getAll" + error)
    }
  }

  getOneByEmail(email: string): CustomerEntity {
    return this.customerRepository.findOneByEmail(email)
  }
}