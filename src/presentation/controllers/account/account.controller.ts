import { Body, Controller, Get, Patch, Post, Delete, Param, Logger } from '@nestjs/common';
import { AccountService } from 'src/business/services';
import { AccountEntity, AccountTypeEntity } from 'src/data';
import { ChangeAccountTypeDto, CreateAccountDto } from 'src/business/dtos';
import { TypeDto } from '../../../business/dtos/type.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {
    }

    @Post("create")
    createAccount(@Body() createAccount: CreateAccountDto): AccountEntity {
        return this.accountService.createAccount(createAccount)
    }

    @Post("type/create/")
    createAccountType(@Body() accountTypeDto: TypeDto): AccountTypeEntity {
        return this.accountService.createAccountType(accountTypeDto)
    }

    @Get("getbalance/:id")
    getBalance(@Param("id") accountId: string): number {
        return this.accountService.getBalance(accountId)
    }

    @Post("addbalance")
    addBalance(@Body() accountId: string, amount: number) {
        return this.accountService.addBalance(accountId, amount)
    }

    @Post("removebalance")
    removeBalance(@Body() accountId: string, amount: number) {
        return this.accountService.removeBalance(accountId, amount)
    }

    @Get("cantransfer")
    verifyAmountIntoBalance(@Body() accountId: string, amount: number): boolean {
        return this.accountService.verifyAmountIntoBalance(accountId, amount)
    }

    @Get("isactive/:id")
    getState(@Param("id") accountId: string): boolean {
        return this.accountService.getState(accountId)
    }

    @Patch("changestate/:id")
    changeState(@Param("id") accountId: string, state?: boolean) {
        this.accountService.changeState(accountId, state)
    }

    @Get("accounttype/:id")
    getAccountType(@Param("id") accountId: string) {
        this.accountService.getAccountType(accountId)
    }

    @Patch("changeacctype")
    changeAccountType(@Body() account: ChangeAccountTypeDto): AccountTypeEntity {
        return this.accountService.changeAccountType(account)
    }

    @Delete("delete/:id")
    deleteAccount(@Param("id") accountId: string) {
        this.accountService.deleteAccount(accountId)
    }

    // tests
    @Get("getall")
    getAll() {
        return this.accountService.getAll()
    }
}
