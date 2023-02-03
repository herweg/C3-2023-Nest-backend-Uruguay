import { Body, Controller, Get, Patch, Post, Delete, Param, Logger, Query } from '@nestjs/common';
import { TransferService } from 'src/business/services';
import { TransferEntity } from 'src/data';
import { DataRangeDto, PaginationDto, TransferDto } from 'src/business/dtos';
import { PaginationModel } from 'src/data/models';
import { ParseIntPipe } from '@nestjs/common/pipes';

@Controller('transfer')
export class TransferController {
    constructor(private readonly transferService: TransferService) { }
    private logger = new Logger('DepositController');

    @Post("create")
    createTransfer(@Body() newTransfer: TransferDto): TransferEntity {
        //Subscribe observer
        this.transferService.transferObservable.subscribe(transfer => {
            this.logger.log(`Transfer ${transfer} created`)
        })
        return this.transferService.createTransfer(newTransfer)
    }

    @Get('/find-all')
    getAll(): TransferEntity[] {
        return this.transferService.getAll()
    }

    @Get("historyout/:id")
    getHistoryOut(@Param("id") accountId: string,
        @Query("offset", ParseIntPipe) offset?: number,
        @Query("limit", ParseIntPipe) limit?: number,
        @Body() dataRange?: DataRangeDto): TransferEntity[] {
        const pagination: PaginationModel = { offset: offset, limit: limit }
        return this.transferService.getHistoryOut(accountId, pagination, dataRange)
    }

    @Get("historyin/:id")
    getHistoryIn(@Param("id") accountId: string,
        @Query("offset", ParseIntPipe) offset?: number,
        @Query("limit", ParseIntPipe) limit?: number,
        @Body() dataRange?: DataRangeDto): TransferEntity[] {
        const pagination: PaginationModel = { offset: offset, limit: limit }
        return this.transferService.getHistoryIn(accountId, pagination, dataRange)
    }

    @Get("history/:id")
    getHistory(@Param("id") accountId: string,
        @Query("offset", ParseIntPipe) offset?: number,
        @Query("limit", ParseIntPipe) limit?: number,
        @Body() dataRange?: DataRangeDto): TransferEntity[] {
        const pagination: PaginationModel = { offset: offset, limit: limit }
        return this.transferService.getHistory(accountId, pagination, dataRange)
    }

    @Delete("delete/:id")
    deleteTransfer(@Param("id") transferId: string): void {
        this.transferService.deleteTransfer(transferId)
    }

}