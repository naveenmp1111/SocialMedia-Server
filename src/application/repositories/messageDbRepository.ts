import { MessageRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/messageRepositoryMongoDb"
import { MessageInterface } from "../../types/MessageInterface"

export const messageDbRepository=(repository:ReturnType<MessageRepositoryMongoDb>)=>{

    const sendMessage=async(message:MessageInterface)=>await repository.sendMessage(message)

    const getFullMessage=async(messageId:any)=>await repository.getFullMessage(messageId as string)

    const getAllMessagesFromChat=async(chatId:string)=>await repository.getAllMessagesFromChat(chatId)

    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage
    }

}

export type MessageDbInterface=typeof messageDbRepository