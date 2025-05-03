import { IsEmail, IsString } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'email' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'пароль' })
    @IsString()
    password: string;
}
