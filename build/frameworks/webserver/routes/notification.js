"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const notificationController_1 = __importDefault(require("../../../adapters/notificationController"));
const notificationDbRepository_1 = require("../../../application/repositories/notificationDbRepository");
const notificationRepositoryMongoDb_1 = require("../../database/monogDB/repositories/notificationRepositoryMongoDb");
const notificationRouter = () => {
    const router = (0, express_1.Router)();
    const controller = (0, notificationController_1.default)(notificationRepositoryMongoDb_1.notficationRepositoryMongoDb, notificationDbRepository_1.notificationDbRepository);
    router.get('/getNotifications', authMiddleware_1.default, controller.getNotifications);
    router.patch('/readNotifications', authMiddleware_1.default, controller.readNotifications);
    return router;
};
exports.default = notificationRouter;
