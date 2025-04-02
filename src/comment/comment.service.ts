import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../post/post.entity';
import { User } from '../user/user.entity';
import { CommentDto } from './comment.dto';
import { CreateCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createComment(createCommentDto: CreateCommentDto, userId: number): Promise<CommentDto> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const post = await this.postRepository.findOne({
            where: { id: createCommentDto.postId }
        });
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const comment = this.commentRepository.create({
            comment: createCommentDto.comment,
            user,
            post,
        });

        const savedComment = await this.commentRepository.save(comment);

        return {
            id: savedComment.id,
            comment: savedComment.comment,
            postId: savedComment.post.id,
            userId: savedComment.user.id,
        };
    }
    async findAllComments() {
        return this.commentRepository.find({
            select: ['id', 'comment', "user", "post"],
        });
    }
    async deleteComments(id: number) {
        const result = await this.commentRepository.delete({id});
        if (result.affected === 0) {
            throw new NotFoundException(`Комментарий с id: ${id} не найден`);
        }
        return { message: 'Комментарий успешно удален' }
    }
}