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
import {UpdatePostDto} from "./post.entity";

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('create')
    async create(@Body() createPostDto: CreatePostDto, @Request() req) {
        const userId = req.user.id;
        return this.postService.createPost(createPostDto, userId);
    }


     @UseGuards(AuthGuard('jwt'))
     @Delete(':id')
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
    async getAllUsers() {
        const posts = await this.postService.findAllPost();
        return posts.map(post => post);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('sort')
    async sortPosts(
        @Query('field') field: string,
        @Query('direction') direction: 'asc' | 'desc' = 'asc'
    ) {
        const allowedFields = ['id', 'title', 'text', 'userId'];
        if (!allowedFields.includes(field)) {
            throw new BadRequestException('Invalid sorting field');
        }

        const normalizedDirection = direction.toLowerCase();
        if (!['asc', 'desc'].includes(normalizedDirection)) {
            throw new BadRequestException('Invalid sorting direction');
        }
        return this.postService.sortPost(field, normalizedDirection as  "asc" | "desc");
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async getOnePost(@Param('id') id: number){
        return await this.postService.findOnePost(id)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    async updatePost(
        @Param('id') id: number,
        @Body() updatedPost: UpdatePostDto,
    ) {
        return this.postService.updatePost(Number(id), updatedPost);
    }




}
