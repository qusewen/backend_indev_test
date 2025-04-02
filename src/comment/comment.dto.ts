export class CommentDto {
    id: number;
    comment: string;
    postId: number;
    userId: number;
}

export class CreateCommentDto {
    comment: string;
    postId: number;
}