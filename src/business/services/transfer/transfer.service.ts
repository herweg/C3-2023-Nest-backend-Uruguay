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

      newTransfer.outcome = newOutcome
      newTransfer.income = newIncome
      newTransfer.amount = transfer.amount
      newTransfer.reason = transfer.reason
      newTransfer.dateTime = Date.now()
      this.transferRepository.register(newTransfer)

      //Feed the Deposit (observer) to the Observable
      this.transferSubject.next(newTransfer)

      if (transfer) {
        this.accountService.removeBalance(transfer.outcome, transfer.amount)
        this.accountService.addBalance(transfer.income, transfer.amount)
      }

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
    dataRange = {
      ... { min: 0, max: Date.now() },
      ...dataRange,
    }
    return this.transferRepository.findOutcomeByDataRange(accountId, dataRange?.min, dataRange?.max, pagination)
    //throw new Error("Error")
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
    dataRange = {
      ... { min: 0, max: Date.now() },
      ...dataRange,
    }
    return this.transferRepository.findIncomeByDataRange(accountId, dataRange?.min, dataRange?.max, pagination)
    //throw new Error("Error")
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
      dataRange = {
        ... { min: 0, max: Date.now() },
        ...dataRange,
      }
      const thisHistory = this.transferRepository.findByDataRange(accountId, dataRange?.min, dataRange?.max, pagination)
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