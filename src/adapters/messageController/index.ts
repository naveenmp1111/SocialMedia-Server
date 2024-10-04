import asyncHandler from "express-async-handler";
import { ChatDbRepository } from "../../application/repositories/chatDbRepository";
import { MessageDbInterface } from "../../application/repositories/messageDbRepository";
import { ChatRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/chatRepositoryMongoDb";
import { MessageRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/messageRepositoryMongoDb";
import { Request, Response } from "express";
import { handleDeleteMessage, handleDeleteMessageForMe, handleGetAllMessagesFromChat, handleGetAllUnreadMessages, handleGetUnreadMessagesFromChat, handleSendMessage, handleSetUnreadMessagesRead } from "../../application/user-cases/message/message";


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
        const { chatId, userId } = req.body
        const messages = await handleGetAllMessagesFromChat(
            chatId,
            userId,
            messageDbRepository
        )
        res.status(200).json({
            status: "success",
            messages
        });
    })

    const getUnreadMessagesFromChat = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, userId } = req.body
        const messages = await handleGetUnreadMessagesFromChat(
            chatId,
            userId,
            messageDbRepository
        )
        res.status(200).json({
            status: "success",
            messages
        });
    })

    const setUnreadMessagesRead = asyncHandler(async (req: Request, res: Response) => {
        const { chatId, userId } = req.body
        await handleSetUnreadMessagesRead(chatId, userId, messageDbRepository)
        res.status(200).json({
            status: "success",
            message: 'set unread messages read successfully'
        })
    })

    const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
        const { messageId, userId } = req.body
        await handleDeleteMessage(messageId, messageDbRepository,chatDbRepository)
        res.status(200).json({
            status: 'success',
            message: 'message deleted successfully'
        })
    })

    const deleteMessageForMe = asyncHandler(async (req: Request, res: Response) => {
        const { messageId, userId } = req.body
        await handleDeleteMessageForMe(messageId, userId, messageDbRepository)
        res.status(200).json({
            status: "success",
            messsage: 'messsage deleted for you successfully'
        })
    })

    const getAllUnreadMessages = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.body
        const messages = await handleGetAllUnreadMessages(userId, messageDbRepository)
        res.status(200).json({
            status: 'success',
            messages
        })
    })

    return {
        sendMessage,
        getAllMessagesFromChat,
        getUnreadMessagesFromChat,
        setUnreadMessagesRead,
        deleteMessage,
        deleteMessageForMe,
        getAllUnreadMessages
    }
}

export default messageController