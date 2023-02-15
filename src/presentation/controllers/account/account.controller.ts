import { Body, Controller, Get, Patch, Post, Delete, Param, Query } from '@nestjs/common';
import { AccountService } from 'src/business/services';
import { AccountEntity, AccountTypeEntity } from 'src/data';
import { ChangeAccountTypeDto, CreateAccountDto } from 'src/business/dtos';
import { TypeDto } from '../../../business/dtos/type.dto';
import { DocumentTypeEntity } from '../../../data/persistance/entities/document-type.entity';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {
    }

    @Post("create")
    createAccount(@Body() createAccount: CreateAccountDto): AccountEntity {
        return this.accountService.createAccount(createAccount)
    }

    @Post("account-type")
    createAccountType(@Body() name: TypeDto): AccountTypeEntity {
        return this.accountService.createAccountType(name)
    }

    @Post("document-type")
    createDocumentType(@Body() name: TypeDto): DocumentTypeEntity {
        return this.accountService.createDocumentType(name)
    }

    @Get("id/:id")
    getAccount(@Param("id") accountId: string): AccountEntity {
        return this.accountService.getId(accountId)
    }

    @Get("getbalance/:id")
    getBalance(@Param("id") accountId: string): number {
        return this.accountService.getBalance(accountId)
    }

    @Post("addbalance/:id/:amount")
    addBalance(@Param("id") accountId: string, @Param("amount") amount: number): number {
        return this.accountService.addBalance(accountId, amount)
    }

    @Post("removebalance/:id/:amount")
    removeBalance(@Param("id") accountId: string, @Param("amount") amount: number) {
        return this.accountService.removeBalance(accountId, amount)
    }

    @Get("cantransfer/:id/:amount")
    verifyAmountIntoBalance(@Param("id") accountId: string, @Param("amount") amount: number): boolean {
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
    getAccountType(@Param("id") accountId: string): AccountTypeEntity {
        return this.accountService.getAccountType(accountId)
    }

    @Patch("changeacctype")
    changeAccountType(@Body() account: ChangeAccountTypeDto): AccountTypeEntity {
        return this.accountService.changeAccountType(account)
    }

    @Delete("delete/:id")
    deleteAccount(@Param("id") accountId: string, @Query("soft") soft?: boolean) {
        this.accountService.deleteAccount(accountId, soft)
    }

    // tests
    @Get("getall")
    getAll() {
        return this.accountService.getAll()
    }
}
