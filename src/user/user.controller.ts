import {Controller, Post, Body, UseGuards, Get} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto, UsersDto} from "./create-user.dto";
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto);
    }

    @UseGuards(AuthGuard('jwt')) // Проверка авторизации
    @Get()
    async getAllUsers() {
        const users = await this.userService.findAll();
        return users.map(user => user.toJSON());
    }

}
