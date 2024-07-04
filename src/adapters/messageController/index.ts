import asyncHandler from "express-async-handler";
import { ChatDbRepository } from "../../application/repositories/chatDbRepository";
import { MessageDbInterface } from "../../application/repositories/messageDbRepository";
import { ChatRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/chatRepositoryMongoDb";
import { MessageRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/messageRepositoryMongoDb";
import { Request, Response } from "express";
import { handleGetAllMessagesFromChat, handleSendMessage } from "../../application/user-cases/message/message";


const messageController = (
    chatDbRepositoryImpl: ChatRepositoryMongoDb,
    chatDbRepositoryInterface: ChatDbRepository,
    messageDbRepositoryImpl: MessageRepositoryMongoDb,
    messageDbRepositoryInterface: MessageDbInterface
) => {
    const chatDbRepository = chatDbRepositoryInterface(chatDbRepositoryImpl())
    const messageDbRepository = messageDbRepositoryInterface(messageDbRepositoryImpl())

    const sendMessage = asyncHandler(async (req: Request, res: Response) => {
        const { message, chatId, userId } = req.body;
        const newMessage = {
            message,
            chatId,
            senderId: userId
        }

        const fullMessage = await handleSendMessage(
            newMessage,
            messageDbRepository,
            chatDbRepository
        );
        res.status(200).json({
            status: "success",
            message: fullMessage
        });
    })

    const getAllMessagesFromChat = asyncHandler(async (req: Request, res: Response) => {
        const { chatId } = req.body
        const messages = await handleGetAllMessagesFromChat(
            chatId,
            messageDbRepository
        )
        console.log('messages from chat is ',messages)
        res.status(200).json({
            status: "success",
            messages
        });
    })

    return {
        sendMessage,
        getAllMessagesFromChat
    }
}

export default messageController