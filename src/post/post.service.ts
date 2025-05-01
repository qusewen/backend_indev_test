import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {Post, UpdatePostDto} from './post.entity';
import { User } from '../user/user.entity';
import {CreatePostDto} from './create-post.dto';

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

    async deletePost(id: number) {
        const result = await this.postRepository.delete({id});
        if (result.affected === 0) {
            throw new NotFoundException(`Пост с id: ${id} не найден, попробуйте другой`);
        }
        return { message: 'Пост успешно удален' }
    }

    async findAllPost() {
        return this.postRepository.find({
            select: ['id', "user", "comments", "text", "title"],
            relations: ['user', 'comments']
        });
    }

    async sortPost(field: string, direction:string) {
        const orderDirection = direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        return this.postRepository.createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .leftJoinAndSelect('post.comments', 'comments')
            .orderBy(`post.${field}`, orderDirection)
            .getMany();
    }

    async findOnePost(id: number) {
        const result = await this.postRepository.findOneBy({id})
        if(result) return result
        else throw 'Пост не найден'
    }




    async updatePost(id: number, updatePost: UpdatePostDto): Promise<Post> {
        const post = await this.postRepository.findOneBy({ id });
        if (!post) {
            throw new NotFoundException(`Пост с id: ${id} не найден`);
        }

        post.title = updatePost.title ?? post.title;
        post.text = updatePost.text ?? post.text;

        return this.postRepository.save(post);
    }
}
