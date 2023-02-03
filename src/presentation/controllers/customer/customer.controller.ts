import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomerService } from 'src/business/services';
import { CustomerEntity } from 'src/data';
import { CustomerDto } from 'src/business/dtos';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Get("info/:id")
    getCustomerInfo(@Param("id") customerId: string):CustomerEntity {
        return this.customerService.getCustomerInfo(customerId)
    }

    @Patch("update/:id")
    updateCustomer(@Param("id") id: string,@Body() customer: CustomerDto):CustomerEntity {
        return this.customerService.updatedCustomer(id, customer)
    }

    @Patch("delete/:id")
    unsubscribe(@Param("id") id: string):void {
        this.customerService.unsubscribe(id)
    }

    @Get("getall")
    getAll():CustomerEntity[]{
        return this.customerService.getAll()
    }
}
