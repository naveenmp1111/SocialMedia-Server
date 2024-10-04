"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRepositoryMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const chatRepositoryMongoDb = () => {
    const createChat = async (loggedInUserId, otherUserId) => {
        try {
            const newChat = new chatModel_1.default({
                members: [
                    loggedInUserId,
                    otherUserId
                ]
            });
            const chat = await newChat.save();
            return chat;
        }
        catch (error) {
            console.log('Erron in creating new Chat ', error);
        }
    };
    const accessChat = async (loggedInUserId, otherUserId) => {
        try {
            const loggedInUserObjectId = new mongoose_1.default.Types.ObjectId(loggedInUserId);
            const otherUserObjectId = new mongoose_1.default.Types.ObjectId(otherUserId);
            const chat = await chatModel_1.default.findOne({
                members: {
                    $all: [loggedInUserObjectId, otherUserObjectId]
                }
            }).populate('members', '-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt')
                .populate('latestMessage');
            return chat;
        }
        catch (error) {
            console.error('Error in fetching chat', error);
            throw new Error('Error in fetching chat');
        }
    };
    const getFullChat = async (chatId) => {
        try {
            const fullChat = await chatModel_1.default.findById(chatId).populate("members", "-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt")
                .populate('latestMessage');
            return fullChat;
        }
        catch (error) {
            console.log('error in getting full chat', error);
        }
    };
    const fetchChats = async (userId) => {
        try {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId); // Convert userId to ObjectId
            const chats = await chatModel_1.default.find({
                members: { $in: [userObjectId] } // Check if userObjectId exists in the members array
            })
                .populate({
                path: 'members',
                match: { isBlock: false }, // Only include members where isBlock is false
                select: '-password -savedPosts -posts -refreshToken -refreshTokenExpiresAt' // Exclude sensitive fields
            })
                .populate('latestMessage')
                .sort({ updatedAt: -1 }); // Sort by createdAt timestamp
            // console.log('chats are ',chats)
            return chats;
        }
        catch (error) {
            console.log('Error in fetching chats ', error);
        }
    };
    const setLatestMessage = async (chatId, messageId) => {
        try {
            const chatObjectId = new mongoose_1.default.Types.ObjectId(chatId);
            // Ensure the message exists and has a message field
            // if (!messageId) {
            //   throw new Error("Message not found or message content is empty");
            // }
            const message = await messageModel_1.default.find({ chatId: chatId, isDeleted: false }).sort({ createdAt: -1 }).limit(1);
            console.log('latest message to be ', message);
            // Update the chat's latest message
            const chatData = await chatModel_1.default.findByIdAndUpdate(chatObjectId, { $set: { latestMessage: message[0]._id } }, { new: true } // Return the updated document
            ).populate('latestMessage');
            // Ensure the chat was found and updated
            if (!chatData) {
                throw new Error("Chat not found or could not be updated");
            }
            // Optionally return the updated chat data
            return chatData;
        }
        catch (err) {
            console.log(err);
            throw new Error("Error in setting latest message");
        }
    };
    return {
        createChat,
        accessChat,
        getFullChat,
        fetchChats,
        setLatestMessage
    };
};
exports.chatRepositoryMongoDb = chatRepositoryMongoDb;
