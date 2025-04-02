import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { CreatePostDto } from './create-post.dto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}


    async createPost(createPostDto: CreatePostDto, userId: number): Promise<Post> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const newPost = this.postRepository.create({
            ...createPostDto,
            user, // Привязываем пост к пользователю
        });

        return this.postRepository.save(newPost);
    }
}
