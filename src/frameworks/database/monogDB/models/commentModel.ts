import mongoose, { ObjectId, Schema, model } from "mongoose";

interface CommentInterface extends Document {
    postId: ObjectId,
    commenterId: ObjectId,
    comment: string,
    parentId: ObjectId
}

const commentSchema = new Schema<CommentInterface>(
    {
        postId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post',
            required:true
        },
        commenterId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        comment:{
            type:String
        },
        parentId:{
            type:mongoose.Schema.Types.ObjectId,
            default:null
        }
    },
    {
        timestamps:true
    }
)


const Comment=model<CommentInterface>('Comment',commentSchema)

export default Comment