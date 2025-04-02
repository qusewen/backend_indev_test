import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from "../user/user.entity";

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
}
