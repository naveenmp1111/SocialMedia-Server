"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDbRepository = void 0;
const messageDbRepository = (repository) => {
    const sendMessage = async (message) => await repository.sendMessage(message);
    const getFullMessage = async (messageId) => await repository.getFullMessage(messageId);
    const getAllMessagesFromChat = async (chatId, userId) => await repository.getAllMessagesFromChat(chatId, userId);
    const getUnreadMessagesFromChat = async (chatId, userId) => await repository.getUnreadMessagesFromChat(chatId, userId);
    const setUnreadMessagesRead = async (chatId, userId) => await repository.setUnreadMessagesRead(chatId, userId);
    const deleteMessage = async (messageId) => await repository.deleteMessage(messageId);
    const deleteMessageForMe = async (messageId, userId) => await repository.deleteMessageForMe(messageId, userId);
    const getAllUnreadMessages = async (userId) => await repository.getAllUnreadMessages(userId);
    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage,
        getUnreadMessagesFromChat,
        setUnreadMessagesRead,
        deleteMessage,
        deleteMessageForMe,
        getAllUnreadMessages
    };
};
exports.messageDbRepository = messageDbRepository;
