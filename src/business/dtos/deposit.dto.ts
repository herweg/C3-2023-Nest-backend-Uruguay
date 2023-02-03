import { IsNumber, IsPositive, IsUUID } from "class-validator"

export class DepositDto {

    @IsUUID(4, { message: "This must be UUID" })
    id: string

    @IsNumber()
    @IsPositive()
    amount: number
}

/**
{
    "id":"0bfa279f-15e2-41e3-b290-a4a9305fd9ff",
    "amount": "10"
}
 */