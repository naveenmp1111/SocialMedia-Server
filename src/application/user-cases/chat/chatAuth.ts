import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
import { ChatDbRepository } from "../../repositories/chatDbRepository";


export const handleCreateOrAccessChat=async(
    loggedInUserId:string,
    otherUserId:string,
    chatDbRepository:ReturnType<ChatDbRepository>
)=>{
    try {
        let chat:any=await chatDbRepository.accessChat(loggedInUserId,otherUserId)
        if(!chat){
            const newChat=await chatDbRepository.createChat(loggedInUserId,otherUserId)
            if (newChat && newChat._id) {
                chat = await chatDbRepository.getFullChat(newChat._id);
            }
        }
        return chat
        
    } catch (error) {
        console.log('error in handlecreateChat',error)
        throw new AppError('Error in handleCreateChat',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleFetchChats=async(
    userId:string,
    chatDbRepository:ReturnType<ChatDbRepository>
)=>{
    try {
        const chats=await chatDbRepository.fetchChats(userId)
        return chats
    } catch (error) {
        console.log('error in fetching chats',error)
        throw new AppError('Error in fetching all chats by user',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}