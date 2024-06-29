"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatDbRepository = void 0;
const chatDbRepository = (repository) => {
    const createChat = (loggedInUserId, otherUserId) => repository.createChat(loggedInUserId, otherUserId);
    const accessChat = (loggedInUserId, otherUserId) => repository.accessChat(loggedInUserId, otherUserId);
    const getFullChat = (chatId) => repository.getFullChat(chatId);
    const fetchChats = (userId) => repository.fetchChats(userId);
    const setLatestMessage = (chatId, messageId) => repository.setLatestMessage(chatId, messageId);
    return {
        createChat,
        accessChat,
        getFullChat,
        fetchChats,
        setLatestMessage
    };
};
exports.chatDbRepository = chatDbRepository;
