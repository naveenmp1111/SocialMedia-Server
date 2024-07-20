"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const notificationAuth_1 = require("../../application/user-cases/notification/notificationAuth");
const notificationController = (notificationDbRepositoryImpl, notificationDbRepositoryInterface) => {
    const dbNotificationRepository = notificationDbRepositoryInterface(notificationDbRepositoryImpl());
    const getNotifications = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        const notifications = await (0, notificationAuth_1.handleGetNotifications)(userId, dbNotificationRepository);
        console.log('notifications are ', notifications);
        res.json({
            status: 'success',
            message: 'Notifications fetched successfully',
            notifications
        });
    });
    const readNotifications = (0, express_async_handler_1.default)(async (req, res) => {
        const { userId } = req.body;
        await (0, notificationAuth_1.handleReadNotification)(userId, dbNotificationRepository);
        res.json({
            status: 'success',
            message: 'made notifications read',
        });
    });
    return {
        getNotifications,
        readNotifications
    };
};
exports.default = notificationController;
