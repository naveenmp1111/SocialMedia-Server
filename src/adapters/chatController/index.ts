import asyncHandler from "express-async-handler";
import { ChatDbRepository } from "../../application/repositories/chatDbRepository";
import { ChatRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/chatRepositoryMongoDb";
import { Request, Response } from "express";
import { handleCreateOrAccessChat, handleFetchChats } from "../../application/user-cases/chat/chatAuth";

const chatController=(
    chatDbRepositoryImpl:ChatRepositoryMongoDb,
    chatDbRepositoryInterface:ChatDbRepository
)=>{
    const chatDbRepository=chatDbRepositoryInterface(chatDbRepositoryImpl())

    const createOrAccessChat=asyncHandler(async(req:Request,res:Response)=>{
        const {userId,otherUserId}=req.body

        const chat=await handleCreateOrAccessChat(userId,otherUserId,chatDbRepository)

        res.status(200).json({
            status:'success',
            message:'chat accessed successfully',
            chat
        })
    })

    const fetchChats=asyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.body

        const chats=await handleFetchChats(userId,chatDbRepository)

        res.status(200).json({
            status:'success',
            message:'chat data fetched successfully',
            chats
        })
      })

    return{
        createOrAccessChat,
        fetchChats
    }
}

export default chatController