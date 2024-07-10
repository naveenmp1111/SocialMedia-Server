"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationDbRepository = void 0;
const notificationDbRepository = (repository) => {
    const createNotification = async (senderId, receiverId, event) => await repository.createNotification({ senderId, receiverId, event });
    const getNotifications = async (receiverId) => await repository.getNotifications(receiverId);
    const readNotifications = async (notificationId) => await repository.readNotifications(notificationId);
    return {
        createNotification,
        getNotifications,
        readNotifications
    };
};
exports.notificationDbRepository = notificationDbRepository;
