import mongoose, { Schema, model } from "mongoose";

const messageSchema=new Schema({
    chatId:{
        type:mongoose.Types.ObjectId,
        ref:'Chat'
    },
    senderId:{
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String
    }
},
{
    timestamps:true
})

const Message=model('Message',messageSchema)

export default Message