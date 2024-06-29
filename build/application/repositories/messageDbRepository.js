"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageDbRepository = void 0;
const messageDbRepository = (repository) => {
    const sendMessage = async (message) => await repository.sendMessage(message);
    const getFullMessage = async (messageId) => await repository.getFullMessage(messageId);
    const getAllMessagesFromChat = async (chatId) => await repository.getAllMessagesFromChat(chatId);
    return {
        sendMessage,
        getAllMessagesFromChat,
        getFullMessage
    };
};
exports.messageDbRepository = messageDbRepository;
