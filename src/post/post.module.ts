import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Post} from "./post.entity";
import {PostService} from "./post.service";
import {PostController} from "./post.controller";
import {UserModule} from "../user/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Post]), UserModule],
    providers: [PostService],
    controllers: [PostController],
    exports: [PostService]
})
export class PostModule {}
