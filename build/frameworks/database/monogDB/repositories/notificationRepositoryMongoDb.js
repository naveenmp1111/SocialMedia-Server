"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notficationRepositoryMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
const { ObjectId } = mongoose_1.default.Types;
const notficationRepositoryMongoDb = () => {
    const createNotification = async ({ senderId, receiverId, event, postId }) => {
        try {
            console.log('reciever ids are ', receiverId);
            const notification = new notificationModel_1.default({
                senderId,
                receiverId,
                event,
                postId: postId
            });
            await notification.save();
            return await notificationModel_1.default.findById(notification._id)
                .populate('postId', 'image')
                .populate('senderId');
        }
        catch (error) {
            console.log(error);
        }
    };
    const deleteNotification = async ({ senderId, receiverId, event, postId }) => {
        try {
            const query = {
                senderId: new ObjectId(senderId),
                receiverId: new ObjectId(receiverId),
                event
            };
            if (postId) {
                query.postId = new ObjectId(postId);
            }
            const result = await notificationModel_1.default.findOneAndDelete(query);
            return result;
        }
        catch (error) {
            console.log(error);
        }
    };
    const getNotifications = async (receiverId) => {
        try {
            const notifications = await notificationModel_1.default.find({ receiverId }).sort({ createdAt: -1 }).populate('senderId').populate('postId', 'image');
            //    console.log('fetched notifications are ',notifications)
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
        createNotification,
        deleteNotification
    };
};
exports.notficationRepositoryMongoDb = notficationRepositoryMongoDb;
