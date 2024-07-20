import Notification from "../models/notificationModel";


export const notficationRepositoryMongoDb = () => {

    const createNotification=async ({senderId,receiverId,event,postId }: { receiverId: string, senderId: string,event:string,postId?:string }) => {
        try {
            // const notifications = await Notification.find({ receiverId}).sort({ timestamp: -1 });
            // return notifications
            const notification= new Notification({
                senderId,
                receiverId,
                event,
                postId: postId ? postId : ''
            })

           return await notification.save()
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

    const readNotifications = async (userId: string) => {
        try {
            await Notification.updateMany({receiverId:userId}, { isSeen: true });
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