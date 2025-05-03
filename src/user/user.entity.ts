import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {Post} from "../post/post.entity";
import {Comment } from '../comment/comment.entity'
import {ApiProperty} from "@nestjs/swagger";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'ФИО' })
    @Column()
    name: string;

    @ApiProperty({ example: 'email' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ example: 'пароль' })
    @Column()
    password: string;

    toJSON() {
        const { password, ...data } = this;
        return data;
    }

    @OneToMany(() => Post, (post) => post.user, { eager: true })
    posts: Post[]; // Массив записей, созданных пользователем

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];
}
