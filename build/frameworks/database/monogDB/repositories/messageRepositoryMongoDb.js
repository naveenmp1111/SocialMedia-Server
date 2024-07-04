"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepositoryMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const messageRepositoryMongoDb = () => {
    const sendMessage = async (newMessage) => {
        try {
            const message = await messageModel_1.default.create(newMessage);
            // console.log('new message created is ',message)
            return message;
        }
        catch (error) {
            console.log('error in creating new message ', error);
        }
    };
    const getFullMessage = async (messageId) => {
        try {
            const messageIdObject = new mongoose_1.default.Types.ObjectId(messageId);
            const fullMessage = await messageModel_1.default.findById(messageIdObject)
                .populate("senderId", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following")
                .populate("chatId")
                .populate("chatId.members", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following");
            console.log('full message is ', fullMessage);
            return fullMessage;
        }
        catch (error) {
            console.log('error in getting full message');
        }
    };
    const getAllMessagesFromChat = async (chatId) => {
        try {
            let chatIdObj = new mongoose_1.default.Types.ObjectId(chatId);
            const messages = await messageModel_1.default.find({ chatId: chatIdObj })
                .populate("senderId", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following")
                .populate("chatId");
            return messages;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in getting messages");
        }
    };
    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage
    };
};
exports.messageRepositoryMongoDb = messageRepositoryMongoDb;
