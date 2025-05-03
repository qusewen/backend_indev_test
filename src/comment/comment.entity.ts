import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { User } from '../user/user.entity';
import { Post } from '../post/post.entity';
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Текст комментария' })
    @Column()
    comment: string;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;

    @Column({ nullable: false })
    @ApiProperty({ example: 'id поста' })
    postId: number;
}