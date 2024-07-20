"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notficationRepositoryMongoDb = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const notficationRepositoryMongoDb = () => {
    const createNotification = async ({ senderId, receiverId, event, postId }) => {
        try {
            // const notifications = await Notification.find({ receiverId}).sort({ timestamp: -1 });
            // return notifications
            const notification = new notificationModel_1.default({
                senderId,
                receiverId,
                event,
                postId: postId ? postId : ''
            });
            return await notification.save();
        }
        catch (error) {
            console.log(error);
        }
    };
    const getNotifications = async (receiverId) => {
        try {
            const notifications = await notificationModel_1.default.find({ receiverId }).sort({ timestamp: -1 });
            return notifications;
        }
        catch (error) {
            console.log(error);
        }
    };
    const readNotifications = async (userId) => {
        try {
            await notificationModel_1.default.updateMany({ receiverId: userId }, { isSeen: true });
        }
        catch (error) {
            console.log(error);
        }
    };
    return {
        getNotifications,
        readNotifications,
        createNotification
    };
};
exports.notficationRepositoryMongoDb = notficationRepositoryMongoDb;
