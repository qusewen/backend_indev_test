import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany} from 'typeorm';
import { User } from "../user/user.entity";
import {Comment } from '../comment/comment.entity'
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column({ unique: true })
    title: string;

    @ManyToOne(() => User, (user) => user.posts, { eager: false })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post, { eager: true })
    comments: Comment[];
}
