import Notification from "../models/notificationModel";


export const notficationRepositoryMongoDb = () => {

    const createNotification=async ({senderId,receiverId,event }: { receiverId: string, senderId: string,event:string }) => {
        try {
            const notifications = await Notification.find({ receiverId}).sort({ timestamp: -1 });
            return notifications
        } catch (error) {
            console.log(error)
        }
    }

    const getNotifications = async (receiverId:string) => {
        try {
            const notifications = await Notification.find({ receiverId}).sort({ timestamp: -1 });
            return notifications
        } catch (error) {
            console.log(error)
        }
    }

    const readNotifications = async (notificationId: string) => {
        try {
            await Notification.findByIdAndUpdate(notificationId, { isSeen: true });
        } catch (error) {
            console.log(error)
        }
    }

    return {
        getNotifications,
        readNotifications,
        createNotification
    }
}

export type NotificationRepositoryMongoDb = typeof notficationRepositoryMongoDb