import {Controller, Post, Body, UseGuards, Get} from '@nestjs/common';
import { UserService } from './user.service';
import {CreateUserDto} from "./create-user.dto";
import { AuthGuard } from '@nestjs/passport';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import { userSwaggerExample} from "../constants/swagerExample";
import {User} from "./user.entity";

@ApiTags('Users - работа с пользователями')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @ApiOperation({ summary: 'Создание пользователя' })
    @ApiBody({type: User})
    @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Получение всех пользователей' })
    @ApiResponse({ status: 200, description: 'Пользователи успешно получены', example: userSwaggerExample })
    @ApiResponse({ status: 400, description: 'Ошибка получения пользователей' })
    @Get()
    async getAllUsers() {
        const users = await this.userService.findAll();
        return users.map(user => user.toJSON());
    }

}
