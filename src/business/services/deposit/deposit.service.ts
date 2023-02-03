import { Injectable, Logger } from '@nestjs/common';
import { DepositEntity, DepositRepository } from 'src/data';
import { DepositDto } from 'src/business/dtos';
import { DataRangeModel, PaginationModel } from 'src/data/models';
import { AccountService } from '../account/account.service';
import { Subject } from 'rxjs';

@Injectable()
export class DepositService {

  constructor(private readonly depositRepository: DepositRepository,
    private readonly accountService: AccountService) {
  }

  //Instance of subject
  private depositSubject = new Subject<DepositEntity>();

  //Create observable
  get depositObservable() {
    return this.depositSubject.asObservable();
  }

  /**
   * Crear un deposito
   *
   * @param {DepositModel} deposit
   * @return {*}  {DepositEntity}
   * @memberof DepositService
   */
  createDeposit(deposit: DepositDto): DepositEntity {
    try {
      //Nuevo deposito y mapeado
      const newDeposit = new DepositEntity()
      newDeposit.account = this.accountService.getId(deposit.id)
      newDeposit.amount = deposit.amount
      newDeposit.dateTime = Date.now()
      //Add new balance
      this.accountService.getId(deposit.id).balance = Number(this.accountService.getId(deposit.id).balance) + Number(deposit.amount)
      //Deposit registry
      this.depositRepository.register(newDeposit)
      //Feed the Deposit (observer) to the Observable
      this.depositSubject.next(newDeposit)

      return newDeposit
    } catch (error) {
      throw new Error("Error en createDeposit" + error)
    }
  }

  /**
   * Borrar un deposito
   *
   * @param {string} depositId
   * @memberof DepositService
   */
  deleteDeposit(depositId: string, soft?: boolean): void {
    try {
      this.depositRepository.delete(depositId)
    } catch (error) {
      throw new Error("Error en deleteDeposit" + error)
    }
  }

  /**
   * Obtener el historial de los depósitos en una cuenta
   *
   * @param {string} depositId
   * @param {PaginationModel} pagination
   * @param {DataRangeModel} [dataRange]
   * @return {*}  {DepositEntity[]}
   * @memberof DepositService
   */
  getHistory(
    depositId: string,
    pagination?: PaginationModel,
    dataRange?: DataRangeModel,
  ): DepositEntity[] {
    dataRange = {
      ... { min: 0, max: Date.now() },
      ...dataRange,
    }
    const depositArrayByDate = this.depositRepository.findByDataRange(dataRange?.min, dataRange?.max, pagination)
    return depositArrayByDate.filter(id => id.id === depositId)
  }
}