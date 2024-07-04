import mongoose from "mongoose"
import { MessageInterface } from "../../../../types/MessageInterface"
import Message from "../models/messageModel"

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
              return fullMessage

        } catch (error) {
            console.log('error in getting full message')
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