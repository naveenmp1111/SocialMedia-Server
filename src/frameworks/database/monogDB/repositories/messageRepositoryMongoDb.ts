import mongoose from "mongoose"
import { MessageInterface } from "../../../../types/MessageInterface"
import Message from "../models/messageModel"
import { getReceiverSocketId } from "../../../webSocket/socketConfig"
import { io } from "../../../../app"


export const messageRepositoryMongoDb = () => {

    const sendMessage = async (newMessage: MessageInterface) => {
        try {
            const message = await Message.create(newMessage)
            // console.log('new message created is ',message)
            return message
        } catch (error) {
            console.log('error in creating new message ', error)
        }
    }

    const getFullMessage=async(messageId:string)=>{
        try {
            const messageIdObject = new mongoose.Types.ObjectId(messageId);
            const fullMessage=await Message.findById(messageIdObject)
            .populate(
                "senderId",
                "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
              )
              .populate("chatId")
              .populate(
                "chatId.members",
                "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
              );
              console.log('full message is ',fullMessage)
              //@ts-ignore
              // console.log('members in messageData is ',fullMessage?.chatId?.members)
              const recieverId = fullMessage?.chatId?.members?.find(item => item.toString() !== fullMessage.senderId._id.toString());

              console.log('recieverid is ',recieverId)
              const receiverSocketId=getReceiverSocketId(recieverId)
              if(receiverSocketId){
                console.log('Ready to emit event to ',receiverSocketId)
                io.to(receiverSocketId).emit('newMessage',fullMessage)
                console.log('here is the erro')
              }
              return fullMessage

        } catch (error) {
            console.log('error in getting full message',error)
        }
    }

    const getAllMessagesFromChat = async (chatId: string) => {
        try {
            let chatIdObj = new mongoose.Types.ObjectId(chatId)
          const messages = await Message.find({chatId:chatIdObj})
            .populate(
              "senderId",
              "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following"
            )
            .populate("chatId")

          return messages;
        } catch (err) {
          console.log(err);
          throw new Error("Error in getting messages");
        }
      };

    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage

    }

}

export type MessageRepositoryMongoDb = typeof messageRepositoryMongoDb