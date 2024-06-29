"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatRepositoryMongoDb_1 = require("../../database/monogDB/repositories/chatRepositoryMongoDb");
const chatDbRepository_1 = require("../../../application/repositories/chatDbRepository");
const chatController_1 = __importDefault(require("../../../adapters/chatController"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const chatRouter = () => {
    const router = (0, express_1.Router)();
    const controller = (0, chatController_1.default)(chatRepositoryMongoDb_1.chatRepositoryMongoDb, chatDbRepository_1.chatDbRepository);
    router.post('/createOrAccessChat', authMiddleware_1.default, controller.createOrAccessChat);
    router.get('/fetchChats', authMiddleware_1.default, controller.fetchChats);
    return router;
};
exports.default = chatRouter;
