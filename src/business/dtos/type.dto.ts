import { IsString } from "class-validator";

export class TypeDto {
    @IsString()
    name: string;
}