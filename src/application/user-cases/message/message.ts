import { MessageRepositoryMongoDb } from "../../../frameworks/database/monogDB/repositories/messageRepositoryMongoDb";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
import { ChatDbRepository } from "../../repositories/chatDbRepository";
import { MessageDbInterface } from "../../repositories/messageDbRepository";

export const handleSendMessage=async(
    message:{message:string,chatId:string,senderId:string},
    messageDbRepository:ReturnType<MessageDbInterface>,
    chatDbRepository:ReturnType<ChatDbRepository>
)=>{
    try {
        if (!message.message.trim() || !message.chatId) {
          throw new AppError("Invalid message", HttpStatus.BAD_REQUEST);
        }
        const createdMessage = await messageDbRepository.sendMessage(message);
            const fullMessage = await messageDbRepository.getFullMessage(
                createdMessage?._id
              );
        
        fullMessage && fullMessage._id &&
          (await chatDbRepository.setLatestMessage(
            message.chatId,
            fullMessage?._id 
          ));
        return fullMessage;
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log(err.message);
          if (err.message === "Invalid message") {
            throw err;
          }
        }
        throw new AppError(
          "Error in sending message",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
}

export const handleGetAllMessagesFromChat=async(
    chatId:string,
    messageDbRepository:ReturnType<MessageDbInterface>
)=>{
    if(!chatId){
        throw new AppError('Invalid chatId',HttpStatus.UNAUTHORIZED)
    }
    try {
        return await messageDbRepository.getAllMessagesFromChat(chatId)
    } catch (error) {
        console.log('error in get full messages from chat ',error)
        throw new AppError('Error in getting full messages from chat ',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}