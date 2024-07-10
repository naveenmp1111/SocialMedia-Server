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
const chatModel_1 = __importDefault(require("../models/chatModel"));
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
            // console.log('full message is ',fullMessage)
            //@ts-ignore
            // console.log('members in messageData is ',fullMessage?.chatId?.members)
            const recieverId = fullMessage?.chatId?.members?.find(item => item.toString() !== fullMessage.senderId._id.toString());
            // console.log('recieverid is ',recieverId)
            const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(recieverId);
            if (receiverSocketId) {
                // console.log('Ready to emit event to ',receiverSocketId)
                app_1.io.to(receiverSocketId).emit('newMessage', fullMessage);
                // console.log('here is the erro')
            }
            return fullMessage;
        }
        catch (error) {
            console.log('error in getting full message', error);
        }
    };
    const getAllMessagesFromChat = async (chatId, userId) => {
        try {
            let chatIdObj = new mongoose_1.default.Types.ObjectId(chatId);
            const messages = await messageModel_1.default.find({
                chatId: chatIdObj,
                isDeleted: { $ne: true },
                deletedBy: { $ne: userId }
            })
                .populate("senderId", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following")
                .populate("chatId");
            return messages;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in getting messages");
        }
    };
    const getUnreadMessagesFromChat = async (chatId, userId) => {
        try {
            let chatIdObj = new mongoose_1.default.Types.ObjectId(chatId);
            const messages = await messageModel_1.default.find({ chatId: chatIdObj, isSeen: false, senderId: { $ne: userId } })
                .populate("senderId", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt -followers -following")
                .populate("chatId");
            return messages;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in getting all unread messages');
        }
    };
    const getAllUnreadMessages = async (userId) => {
        try {
            const chatIds = await chatModel_1.default.find({ members: { $in: [userId] } }, { chatId: 1, _id: 0 } // Include chatId and exclude _id
            );
            // Extract chatId values from the array of objects
            // const chatIdArray = chatIds.map(chat => chat.chatId);
            // // Use the extracted chatId values in the Message.find query
            // const messages = await Message.find({ chatId: { $in: chatIdArray } });
            return;
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in getting all unread messages');
        }
    };
    const setUnreadMessagesRead = async (chatId, userId) => {
        try {
            let chatIdObj = new mongoose_1.default.Types.ObjectId(chatId);
            await messageModel_1.default.updateMany({ chatId: chatIdObj, isSeen: false, senderId: { $ne: userId } }, { isSeen: true });
        }
        catch (error) {
            console.log(error);
            throw new Error('Error in setting unread messages read.');
        }
    };
    const deleteMessage = async (messageId, userId) => {
        try {
            let messageIdObj = new mongoose_1.default.Types.ObjectId(messageId);
            const messageData = await messageModel_1.default.findByIdAndUpdate(messageIdObj, { isDeleted: true }).populate('chatId');
            console.log('messageData on deletion ', messageData);
            //@ts-ignore
            const recieverId = messageData?.chatId?.members?.find(item => item.toString() !== messageData?.senderId._id.toString());
            // console.log('recieverid is ',recieverId)
            const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(recieverId);
            if (receiverSocketId) {
                // console.log('Ready to emit event to ',receiverSocketId)
                app_1.io.to(receiverSocketId).emit('deleteMessage', messageId);
                // console.log('here is the erro')
            }
            const lastMessage = await messageModel_1.default.find({ chatId: messageData?.chatId, isDeleted: false }).sort({ createdAt: -1 }).limit(1);
            //   console.log('latestmessage inside chat is',lastMessage)
            //   //@ts-ignore  
            //   let chatIdObj=new mongoose.Types.ObjectId(messageData?.chatId as string)
            //   //@ts-ignore
            //  const updatedChat = await Chat.findByIdAndUpdate(chatIdObj,{latestMessage:lastMessage.message},{new:true})
            //  console.log('updated chat is ',updatedChat)
        }
        catch (error) {
            console.log('error in deleting message', error);
            throw new Error('Error in deleting message');
        }
    };
    const deleteMessageForMe = async (messageId, userId) => {
        try {
            let messageIdObj = new mongoose_1.default.Types.ObjectId(messageId);
            await messageModel_1.default.findByIdAndUpdate(messageIdObj, { $addToSet: { deletedBy: userId } });
        }
        catch (error) {
            console.log('error is ', error);
            throw new Error('Error in deleting message for me');
        }
    };
    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage,
        getUnreadMessagesFromChat,
        setUnreadMessagesRead,
        deleteMessage,
        deleteMessageForMe
    };
};
exports.messageRepositoryMongoDb = messageRepositoryMongoDb;
