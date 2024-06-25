import { CommentRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/commentRepostitoryMongoDb";
import { CommentDataInterface, ReplyCommentInterface } from "../../types/CommentInterface";

export const commentDbRepository=(repository:ReturnType<CommentRepositoryMongoDb>)=>{

    const addComment=async(commentObj:CommentDataInterface)=>repository.addComment(commentObj)

    const getComments=async(postId:string)=>repository.getComments(postId)

    const addReply=async(replyObj:ReplyCommentInterface)=>repository.addReply(replyObj)

    return {
        addComment,
        getComments,
        addReply
    }
}

export type CommentDbInterface=typeof commentDbRepository