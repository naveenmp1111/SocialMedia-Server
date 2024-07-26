export interface CommentDataInterface {
    postId: string,
    commenterId: string,
    comment: string,
}

export interface ReplyCommentInterface {
    postId: string,
    commenterId: string,
    parentId: string,
    comment: string
}