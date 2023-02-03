import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { DepositService } from 'src/business/services';
import { DepositEntity } from 'src/data';
import { DataRangeDto, DepositDto } from 'src/business/dtos';
import { PaginationModel } from 'src/data/models';

@Controller('deposit')
export class DepositController {
    constructor(private readonly depositService: DepositService) { }
    private logger = new Logger('DepositController');

    @Post("create")
    createDeposit(@Body() newDeposit: DepositDto): DepositEntity {
        //subscribe observer
        this.depositService.depositObservable.subscribe(deposit => {
            this.logger.log(`Deposit ${deposit.id} created`)
        })
        return this.depositService.createDeposit(newDeposit)
    }

    @Delete("delete/:id/:bool")
    deleteDeposit(@Param("id") depositId: string, @Param("bool") depositDelete: boolean) {
        this.depositService.deleteDeposit(depositId, depositDelete)
    }

    @Get("history/:id")
    getHistory(@Param("id") depositId: string,
        @Query("offset", ParseIntPipe) offset?: number,
        @Query("limit", ParseIntPipe) limit?: number,
        @Body() dataRange?: DataRangeDto) {
        const pagination: PaginationModel = { offset: offset, limit: limit }
        return this.depositService.getHistory(depositId, pagination, dataRange)
    }
}
