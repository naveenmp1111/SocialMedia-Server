"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleReadNotification = exports.handleGetNotifications = void 0;
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const handleGetNotifications = async (userId, notificationDbRepository) => {
    try {
        const notifications = await notificationDbRepository.getNotifications(userId);
        return notifications;
    }
    catch (error) {
        console.log('error in fetching notifications', error);
        throw new appError_1.default('Error in fetching notification', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleGetNotifications = handleGetNotifications;
const handleReadNotification = async (userId, notificationDbRepository) => {
    try {
        await notificationDbRepository.readNotifications(userId);
    }
    catch (error) {
        console.log('error in handling read notification', error);
        throw new appError_1.default('Error in handling read notification', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
};
exports.handleReadNotification = handleReadNotification;
