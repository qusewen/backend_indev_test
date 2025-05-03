import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import {IsIn, IsOptional, IsString} from 'class-validator';
import { User } from "../user/user.entity";
import {Comment } from '../comment/comment.entity'
import {ApiProperty} from "@nestjs/swagger";
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'Текст поста' })
    @Column()
    text: string;

    @ApiProperty({ example: 'Заголовок поста' })
    @Column({ unique: true })
    title: string;

    @ManyToOne(() => User, (user) => user.posts, { eager: false })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
    comments: Comment[];
}



export class UpdatePostDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Заголовок поста' })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Текст поста' })
    text?: string;
}
