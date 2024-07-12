import { MessageRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/messageRepositoryMongoDb"
import { MessageInterface } from "../../types/MessageInterface"

export const messageDbRepository=(repository:ReturnType<MessageRepositoryMongoDb>)=>{

    const sendMessage=async(message:MessageInterface)=>await repository.sendMessage(message)

    const getFullMessage=async(messageId:any)=>await repository.getFullMessage(messageId as string)

    const getAllMessagesFromChat=async(chatId:string,userId:string)=>await repository.getAllMessagesFromChat(chatId,userId)

    const getUnreadMessagesFromChat=async(chatId:string,userId:string)=>await repository.getUnreadMessagesFromChat(chatId,userId)

    const setUnreadMessagesRead=async(chatId:string,userId:string)=>await repository.setUnreadMessagesRead(chatId,userId)

    const deleteMessage=async(messageId:string)=>await repository.deleteMessage(messageId)

    const deleteMessageForMe=async(messageId:string,userId:string)=>await repository.deleteMessageForMe(messageId,userId)

    const getAllUnreadMessages=async(userId:string)=>await repository.getAllUnreadMessages(userId)

    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage,
        getUnreadMessagesFromChat,
        setUnreadMessagesRead,
        deleteMessage,
        deleteMessageForMe,
        getAllUnreadMessages
    }

}

export type MessageDbInterface=typeof messageDbRepository