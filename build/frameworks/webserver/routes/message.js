"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatRepositoryMongoDb_1 = require("../../database/monogDB/repositories/chatRepositoryMongoDb");
const chatDbRepository_1 = require("../../../application/repositories/chatDbRepository");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const messageRepositoryMongoDb_1 = require("../../database/monogDB/repositories/messageRepositoryMongoDb");
const messageDbRepository_1 = require("../../../application/repositories/messageDbRepository");
const messageController_1 = __importDefault(require("../../../adapters/messageController"));
const messageRouter = () => {
    const router = (0, express_1.Router)();
    const controller = (0, messageController_1.default)(chatRepositoryMongoDb_1.chatRepositoryMongoDb, chatDbRepository_1.chatDbRepository, messageRepositoryMongoDb_1.messageRepositoryMongoDb, messageDbRepository_1.messageDbRepository);
    router.post('/sendMessage', authMiddleware_1.default, controller.sendMessage);
    router.post('/getFullMessagesFromChat', authMiddleware_1.default, controller.getAllMessagesFromChat);
    router.post('/getUnreadMessagesFromChat', authMiddleware_1.default, controller.getUnreadMessagesFromChat);
    router.patch('/setUnreadMessagesRead', authMiddleware_1.default, controller.setUnreadMessagesRead);
    router.patch('/deleteMessage', authMiddleware_1.default, controller.deleteMessage);
    router.patch('/deleteMessageForMe', authMiddleware_1.default, controller.deleteMessageForMe),
        router.get('/getAllUnreadMessages', authMiddleware_1.default, controller.getAllUnreadMessages);
    return router;
};
exports.default = messageRouter;
