"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRepositoryMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const socketConfig_1 = require("../../../webSocket/socketConfig");
const app_1 = require("../../../../app");
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
            //@ts-ignore
            // console.log('members in messageData is ',fullMessage?.chatId?.members)
            const recieverId = fullMessage?.chatId?.members?.find(item => item.toString() !== fullMessage.senderId._id.toString());
            console.log('recieverid is ', recieverId);
            const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(recieverId);
            if (receiverSocketId) {
                console.log('Ready to emit event to ', receiverSocketId);
                app_1.io.to(receiverSocketId).emit('newMessage', fullMessage);
                console.log('here is the erro');
            }
            return fullMessage;
        }
        catch (error) {
            console.log('error in getting full message', error);
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
