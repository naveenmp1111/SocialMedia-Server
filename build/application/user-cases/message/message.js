"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDeleteMessageForMe = exports.handleDeleteMessage = exports.handleSetUnreadMessagesRead = exports.handleGetUnreadMessagesFromChat = exports.handleGetAllMessagesFromChat = exports.handleSendMessage = void 0;
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const handleSendMessage = async (message, messageDbRepository, chatDbRepository) => {
    try {
        if (!message.message.trim() || !message.chatId) {
            throw new appError_1.default("Invalid message", httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const createdMessage = await messageDbRepository.sendMessage(message);
        const fullMessage = await messageDbRepository.getFullMessage(createdMessage?._id);
        fullMessage && fullMessage._id &&
            (await chatDbRepository.setLatestMessage(message.chatId, fullMessage?._id));
        return fullMessage;
    }
    catch (err) {
        if (err instanceof Error) {
            console.log(err.message);
            if (err.message === "Invalid message") {
                throw err;
            }
        }
        throw new appError_1.default("Error in sending message", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleSendMessage = handleSendMessage;
const handleGetAllMessagesFromChat = async (chatId, userId, messageDbRepository) => {
    if (!chatId) {
        throw new appError_1.default('Invalid chatId', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    try {
        await messageDbRepository.setUnreadMessagesRead(chatId, userId);
        return await messageDbRepository.getAllMessagesFromChat(chatId, userId);
    }
    catch (error) {
        console.log('error in get full messages from chat ', error);
        throw new appError_1.default('Error in getting full messages from chat ', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleGetAllMessagesFromChat = handleGetAllMessagesFromChat;
const handleGetUnreadMessagesFromChat = async (chatId, userId, messageDbRepository) => {
    if (!chatId) {
        throw new appError_1.default('Invalid chatId', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    try {
        return await messageDbRepository.getUnreadMessagesFromChat(chatId, userId);
    }
    catch (error) {
        console.log('error in get unread messages from chat ', error);
        throw new appError_1.default('Error in getting unread messages from chat ', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleGetUnreadMessagesFromChat = handleGetUnreadMessagesFromChat;
const handleSetUnreadMessagesRead = async (chatId, userId, messageDbRepository) => {
    if (!chatId) {
        throw new appError_1.default('Invalid chatId', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    try {
        return await messageDbRepository.setUnreadMessagesRead(chatId, userId);
    }
    catch (error) {
        console.log('error in setting unread messages read ', error);
        throw new appError_1.default('Error in setting unread messages read ', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleSetUnreadMessagesRead = handleSetUnreadMessagesRead;
const handleDeleteMessage = async (messageId, messageDbRepository) => {
    if (!messageId) {
        throw new appError_1.default('Invalid messageId', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    try {
        return await messageDbRepository.deleteMessage(messageId);
    }
    catch (error) {
        throw new appError_1.default('Error in deleting message', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleDeleteMessage = handleDeleteMessage;
const handleDeleteMessageForMe = async (messageId, userId, messageDbRepository) => {
    if (!messageId) {
        throw new appError_1.default('Invalid messageId', httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    try {
        return await messageDbRepository.deleteMessageForMe(messageId, userId);
    }
    catch (error) {
        throw new appError_1.default('Error in deleting message', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleDeleteMessageForMe = handleDeleteMessageForMe;
