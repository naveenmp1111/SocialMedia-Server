import mongoose, { Schema, model } from "mongoose";


const chatSchema = new Schema({
    members: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    latestMessage:{
        type:String
    }
},{
    timestamps:true
})

const Chat=model('Chat',chatSchema)
export default Chat