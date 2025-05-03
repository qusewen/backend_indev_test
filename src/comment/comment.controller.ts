import {Controller, Post, Body, UseGuards, Request, Get, Delete, HttpCode, HttpStatus, Param} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Comment} from "./comment.entity";
import {commentsSwaggerExample} from "../constants/swagerExample";

@ApiTags('Comments - работа с комментариями к посту')

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @ApiOperation({ summary: 'Создание комментария' })
    @ApiBody({type: Comment})
    @ApiResponse({ status: 201, description: 'Комментарий успешно создан' })
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
    ) {
        return this.commentService.createComment(
            createCommentDto,
            req.user.id
        );
    }
    @UseGuards(AuthGuard('jwt'))
    @Get()
    @ApiOperation({ summary: 'Получение всех комментариев' })
    @ApiResponse({ status: 201, description: 'Комментарии успешно получены', example:[commentsSwaggerExample] })
    async getAllUsers() {
    const comments = await this.commentService.findAllComments();
    return comments.map(comment => comment);
}

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    @ApiOperation({ summary: 'Удаление комментария по id' })
    @ApiResponse({ status: 201, description: 'Комментарий успешно удален' })
    @HttpCode(HttpStatus.OK)
    async deleteComment(@Param('id') id: number): Promise<{status: string, message: string}> {
     const result = await this.commentService.deleteComments(id);
        return {
            status: 'success',
            message: result.message
        }
    }
}