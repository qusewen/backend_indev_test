import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import {CommentController} from "./post.controller";
import {Post} from "../post/post.entity";
import {User} from "../user/user.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Comment, Post, User]),
        PostModule,
        UserModule,
    ],
    providers: [CommentService],
    controllers: [CommentController],
})
export class CommentModule {}