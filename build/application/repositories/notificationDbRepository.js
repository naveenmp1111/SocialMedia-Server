"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDbRepository = void 0;
const notificationDbRepository = (repository) => {
    const createNotification = async (senderId, receiverId, event, postId) => await repository.createNotification({ senderId, receiverId, event, postId });
    const getNotifications = async (receiverId) => await repository.getNotifications(receiverId);
    const readNotifications = async (userId) => await repository.readNotifications(userId);
    const deleteNotification = async (senderId, receiverId, event, postId) => await repository.deleteNotification({ senderId, receiverId, event, postId });
    return {
        createNotification,
        getNotifications,
        readNotifications,
        deleteNotification
    };
};
exports.notificationDbRepository = notificationDbRepository;
