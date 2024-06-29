"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFetchChats = exports.handleCreateOrAccessChat = void 0;
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const handleCreateOrAccessChat = async (loggedInUserId, otherUserId, chatDbRepository) => {
    try {
        let chat = await chatDbRepository.accessChat(loggedInUserId, otherUserId);
        if (!chat) {
            const newChat = await chatDbRepository.createChat(loggedInUserId, otherUserId);
            if (newChat && newChat._id) {
                chat = await chatDbRepository.getFullChat(newChat._id);
            }
        }
        return chat;
    }
    catch (error) {
        console.log('error in handlecreateChat', error);
        throw new appError_1.default('Error in handleCreateChat', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleCreateOrAccessChat = handleCreateOrAccessChat;
const handleFetchChats = async (userId, chatDbRepository) => {
    try {
        const chats = await chatDbRepository.fetchChats(userId);
        return chats;
    }
    catch (error) {
        console.log('error in fetching chats', error);
        throw new appError_1.default('Error in fetching all chats by user', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleFetchChats = handleFetchChats;
