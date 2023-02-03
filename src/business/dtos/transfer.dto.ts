import { IsString, IsUUID, IsNumber, IsPositive } from 'class-validator';

export class TransferDto {

    //@IsUUID(4, { message: "This must be UUID" })
    @IsString()
    outcome: string

    //@IsUUID(4, { message: "This must be UUID" })
    @IsString()
    income: string

    @IsNumber()
    @IsPositive()
    amount: number

    @IsString()
    reason: string
}

/*
{
    "outcome": "string",
    "income": "string",
    "amount": "number",
    "reason": "string"
}
*/