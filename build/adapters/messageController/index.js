"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const message_1 = require("../../application/user-cases/message/message");
const messageController = (chatDbRepositoryImpl, chatDbRepositoryInterface, messageDbRepositoryImpl, messageDbRepositoryInterface) => {
    const chatDbRepository = chatDbRepositoryInterface(chatDbRepositoryImpl());
    const messageDbRepository = messageDbRepositoryInterface(messageDbRepositoryImpl());
    const sendMessage = (0, express_async_handler_1.default)(async (req, res) => {
        const { message, chatId, userId } = req.body;
        const newMessage = {
            message,
            chatId,
            senderId: userId
        };
        const fullMessage = await (0, message_1.handleSendMessage)(newMessage, messageDbRepository, chatDbRepository);
        res.status(200).json({
            status: "success",
            message: fullMessage
        });
    });
    const getAllMessagesFromChat = (0, express_async_handler_1.default)(async (req, res) => {
        const { chatId, userId } = req.body;
        const messages = await (0, message_1.handleGetAllMessagesFromChat)(chatId, userId, messageDbRepository);
        res.status(200).json({
            status: "success",
            messages
        });
    });
    const getUnreadMessagesFromChat = (0, express_async_handler_1.default)(async (req, res) => {
        const { chatId, userId } = req.body;
        const messages = await (0, message_1.handleGetUnreadMessagesFromChat)(chatId, userId, messageDbRepository);
        res.status(200).json({
            status: "success",
            messages
        });
    });
    const setUnreadMessagesRead = (0, express_async_handler_1.default)(async (req, res) => {
        const { chatId, userId } = req.body;
        await (0, message_1.handleSetUnreadMessagesRead)(chatId, userId, messageDbRepository);
        res.status(200).json({
            status: "success",
            message: 'set unread messages read successfully'
        });
    });
    const deleteMessage = (0, express_async_handler_1.default)(async (req, res) => {
        const { messageId, userId } = req.body;
        await (0, message_1.handleDeleteMessage)(messageId, messageDbRepository);
        res.status(200).json({
            status: 'success',
            message: 'message deleted successfully'
        });
    });
    const deleteMessageForMe = (0, express_async_handler_1.default)(async (req, res) => {
        const { messageId, userId } = req.body;
        await (0, message_1.handleDeleteMessageForMe)(messageId, userId, messageDbRepository);
        res.status(200).json({
            status: "success",
            messsage: 'messsage deleted for you successfully'
        });
    });
    const getAllUnreadMessages = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const messages = await (0, message_1.handleGetAllUnreadMessages)(userId, messageDbRepository);
        res.status(200).json({
            status: 'success',
            messages
        });
    });
    return {
        sendMessage,
        getAllMessagesFromChat,
        getUnreadMessagesFromChat,
        setUnreadMessagesRead,
        deleteMessage,
        deleteMessageForMe,
        getAllUnreadMessages
    };
};
exports.default = messageController;
