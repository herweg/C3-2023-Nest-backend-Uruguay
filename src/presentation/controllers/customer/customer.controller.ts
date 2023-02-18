import { BadRequestException, Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomerService } from 'src/business/services';
import { CustomerEntity } from 'src/data';
import { CustomerDto } from 'src/business/dtos';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Get("info/:id")
    getCustomerInfo(@Param("id") customerId: string): CustomerEntity {
        return this.customerService.getCustomerInfo(customerId)
    }

    @Patch("/update/:id")
    updateCustomer(@Param("id") id: string, @Body() customer: CustomerDto): CustomerEntity {
        if (!uuidv4(id)) {
            throw new BadRequestException("Invalid ID");
        }
        return this.customerService.updatedCustomer(id, customer)
    }

    @Patch("delete/:id")
    unsubscribe(@Param("id") id: string): void {
        this.customerService.unsubscribe(id)
    }

    @Get("getall")
    getAll(): CustomerEntity[] {
        return this.customerService.getAll()
    }

    @Get("getbyemail/:email")
    getByEmail(@Param("email") email: string): CustomerEntity {
        return this.customerService.getOneByEmail(email)
    }
}
function uuidv4(id: string) {
    const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidv4Regex.test(id);
}

