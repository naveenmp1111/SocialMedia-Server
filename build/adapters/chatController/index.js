"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chatAuth_1 = require("../../application/user-cases/chat/chatAuth");
const chatController = (chatDbRepositoryImpl, chatDbRepositoryInterface) => {
    const chatDbRepository = chatDbRepositoryInterface(chatDbRepositoryImpl());
    const createOrAccessChat = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId, otherUserId } = req.body;
        const chat = await (0, chatAuth_1.handleCreateOrAccessChat)(userId, otherUserId, chatDbRepository);
        res.status(200).json({
            status: 'success',
            message: 'chat accessed successfully'
        });
    });
    const fetchChats = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const chats = await (0, chatAuth_1.handleFetchChats)(userId, chatDbRepository);
        res.status(200).json({
            status: 'success',
            message: 'chat data fetched successfully',
            chats
        });
    });
    return {
        createOrAccessChat,
        fetchChats
    };
};
exports.default = chatController;
