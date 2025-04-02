import {Controller, Post, Body, UseGuards, Request, Get, Delete, HttpCode, HttpStatus, Param} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './comment.dto';

@Controller('comments')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
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
    async getAllUsers() {
    const comments = await this.commentService.findAllComments();
    return comments.map(comment => comment);
}

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async deleteComment(@Param('id') id: number): Promise<{status: string, message: string}> {
     const result = await this.commentService.deleteComments(id);
        return {
            status: 'success',
            message: result.message
        }
    }
}