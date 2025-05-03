import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Request,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    Patch, Query, BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {CreatePostDto} from "./create-post.dto";
import {PostService} from "./post.service";
import { UpdatePostDto} from "./post.entity";
import {
    ApiBody,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import {Post as PostDto} from './post.entity'
import {postSwaggerExample} from "../constants/swagerExample";
@ApiTags('Post - работа с постами')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    @ApiOperation({ summary: 'Создание поста' })
    @ApiBody({type: PostDto})
    @ApiResponse({ status: 201, description: 'Пост успешно создан' })
    async create(@Body() createPostDto: CreatePostDto, @Request() req) {
        const userId = req.user.id;
        return this.postService.createPost(createPostDto, userId);
    }


     @UseGuards(AuthGuard('jwt'))
     @Delete(':id')
     @ApiOperation({ summary: 'Удаление поста' })
     @ApiResponse({ status: 201, description: 'Пост успешно удален' })
     @HttpCode(HttpStatus.OK)
     async deletePost(@Param('id') id: number): Promise<{status: string, message: string}> {
         const result = await this.postService.deletePost(id);
         return {
             status: 'success',
             message: result.message
         }
     }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({ summary: 'Получение всех постов с возможной сортировкой' })
    @ApiQuery({ name: 'field', required: false, enum: ['id', 'title', 'text', 'userId'] })
    @ApiQuery({ name: 'direction', required: false, enum: ['asc', 'desc'] })
    @ApiResponse({ status: 200, description: 'Посты получены', example: [postSwaggerExample] })
    @ApiResponse({ status: 400, description: 'Некорректный параметр сортировки' })
    async getPosts(
        @Query('field') field?: string,
        @Query('direction') direction?: 'asc' | 'desc'
    ) {
        const allowedFields = ['id', 'title', 'text', 'userId'];

        if (!field) {
            return this.postService.findAllPost();
        }

        if (!allowedFields.includes(field)) {
            throw new BadRequestException('Invalid sorting field');
        }

        const normalizedDirection = direction?.toLowerCase() ?? 'asc';
        if (!['asc', 'desc'].includes(normalizedDirection)) {
            throw new BadRequestException('Invalid sorting direction');
        }

        return this.postService.sortPost(field, normalizedDirection as 'asc' | 'desc');
    }


    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    @ApiOperation({ summary: 'Получение поста по id' })
    @ApiResponse({ status: 200, description: 'Пост найден', example: postSwaggerExample })
    @ApiResponse({ status: 404, description: 'Пост не найден' })
    @HttpCode(HttpStatus.OK)
    async getOnePost(@Param('id') id: number){
        return await this.postService.findOnePost(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    @ApiOperation({ summary: 'Обновление данных поста' })
    @ApiBody({type: UpdatePostDto})
    @ApiResponse({ status: 201, description: 'Пост успешно обновлен' })
    @ApiResponse({ status: 404, description: 'Пост не найден' })

    async updatePost(
        @Param('id') id: number,
        @Body() updatedPost: UpdatePostDto,
    ) {
        return this.postService.updatePost(Number(id), updatedPost);
    }
}
