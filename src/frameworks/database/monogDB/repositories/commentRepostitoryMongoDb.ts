import mongoose from "mongoose"
import { CommentDataInterface, ReplyCommentInterface } from "../../../../types/CommentInterface"
import Comment from "../models/commentModel"
const { ObjectId } = mongoose.Types

export const commentRepositoryMongoDb = () => {

    const addComment = async (commentObj: CommentDataInterface) => {
        try {
            const comment = new Comment(commentObj)
            const savedComment = await comment.save()
            return savedComment
        } catch (error) {
            console.log('error in adding comment ', error)
        }
    }

    const addReply = async (ReplyObj: ReplyCommentInterface) => {
        try {
            const comment = new Comment(ReplyObj)
            const savedComment = await comment.save()
            return savedComment
        } catch (error) {
            console.log('error in adding reply', error)
        }
    }

    const getComments = async (postId: string) => {
        try {
            const PostObj = new ObjectId(postId);
            const comments = await Comment.aggregate([
                { $match: { postId: PostObj } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'commenterId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        postId: 1,
                        comment: 1,
                        parentId: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: { _id: 1, name: 1, username: 1, profilePic: 1 },
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
            ])
            return comments
        } catch (error) {
            console.log('Error in getting comments ', error)
        }
    }

    return {
        addComment,
        getComments,
        addReply
    }
}

export type CommentRepositoryMongoDb = typeof commentRepositoryMongoDb