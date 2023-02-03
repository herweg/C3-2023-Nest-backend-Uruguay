import { Injectable } from '@nestjs/common';
import { TransferEntity, TransferRepository } from 'src/data';
import { DataRangeDto, PaginationDto, TransferDto } from 'src/business/dtos';
import { AccountService } from '../account';
import { Subject } from 'rxjs';
import { PaginationModel } from 'src/data/models';

@Injectable()
export class TransferService {
  constructor(private readonly transferRepository: TransferRepository,
    private readonly accountService: AccountService) { }

  //Instance of subject
  private transferSubject = new Subject<TransferEntity>();

  //Create observable
  get transferObservable() {
    return this.transferSubject.asObservable();
  }
  /**
   * Crear una transferencia entre cuentas del banco
   *
   * @param {TransferModel} transfer
   * @return {*}  {TransferEntity}
   * @memberof TransferService
   */
  createTransfer(transfer: TransferDto): TransferEntity {
    try {
      const newTransfer = new TransferEntity()
      const newIncome = this.accountService.getId(transfer.income)
      const newOutcome = this.accountService.getId(transfer.outcome)
      newTransfer.amount = transfer.amount
      newTransfer.income = newIncome
      newTransfer.outcome = newOutcome
      newTransfer.reason = transfer.reason
      newTransfer.dateTime = Date.now()
      this.transferRepository.register(newTransfer)
      //Feed the Deposit (observer) to the Observable
      this.transferSubject.next(newTransfer)
      
      return newTransfer
    } catch (error) {
      throw new Error("Error en createTransfer" + error)
    }
  }

  /**
   * Obtener historial de transacciones de salida de una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeDto} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  getHistoryOut(
    accountId: string,
    pagination?: PaginationDto,
    dataRange?: DataRangeDto,
  ): TransferEntity[] {
    if (!dataRange?.min || !dataRange?.max) throw new Error("Error")
    this.transferRepository.findOutcomeByDataRange(accountId, dataRange?.min, dataRange?.max, pagination)
    return this.transferRepository.getAll()
  }

  /**
   * Obtener historial de transacciones de entrada en una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeDto} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  getHistoryIn(
    accountId: string,
    pagination?: PaginationDto,
    dataRange?: DataRangeDto,
  ): TransferEntity[] {
    if (!dataRange?.min || !dataRange?.max) throw new Error("Error")
    this.transferRepository.findIncomeByDataRange(accountId, dataRange?.min, dataRange?.max, pagination)
    return this.transferRepository.getAll()
  }

  /**
   * Obtener historial de transacciones de una cuenta
   *
   * @param {string} accountId
   * @param {PaginationModel} pagination
   * @param {DataRangeDto} [dataRange]
   * @return {*}  {TransferEntity[]}
   * @memberof TransferService
   */
  getHistory(
    accountId: string,
    pagination?: PaginationDto,
    dataRange?: DataRangeDto,
  ): TransferEntity[] {
    try {
      const thisHistory = this.getHistoryIn(accountId, pagination, dataRange)
        .concat(this.getHistoryOut(accountId, pagination, dataRange))
      return thisHistory
    } catch (error) {
      throw new Error("Error en getHistory" + error)
    }
  }

  getAll(pagination: PaginationModel): TransferEntity[] {
    return this.transferRepository.getAll();
  }

  /**
   * Borrar una transacción
   *
   * @param {string} transferId
   * @memberof TransferService
   */
  deleteTransfer(transferId: string): void {
    try {
      this.transferRepository.delete(transferId)
    } catch (error) {
      throw new Error("Error en deleteTransfer" + error)
    }
  }
}