import {Controller, Post, Body, UseGuards, Get, Request} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {CreatePostDto} from "./create-post.dto";
import {PostService} from "./post.service";

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard('jwt')) // Убедитесь, что пользователь авторизован
    @Post('create')
    async create(@Body() createPostDto: CreatePostDto, @Request() req) {
        const userId = req.user.id; // Получаем ID пользователя из токена
        return this.postService.createPost(createPostDto, userId);
    }


    // @UseGuards(AuthGuard('jwt')) // Проверка авторизации
    // @Get()
    // async getAllUsers() {
    //     const users = await this.postService.findAll();
    //     return users.map(user => user.toJSON());
    // }

}
