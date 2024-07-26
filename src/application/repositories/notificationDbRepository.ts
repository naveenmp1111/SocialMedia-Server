import { NotificationRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/notificationRepositoryMongoDb"

export const notificationDbRepository = (repository: ReturnType<NotificationRepositoryMongoDb>) => {

    const createNotification = async (senderId: string, receiverId: string, event: string, postId?: string) => await repository.createNotification({ senderId, receiverId, event, postId })

    const getNotifications = async (receiverId: string) => await repository.getNotifications(receiverId)

    const readNotifications = async (userId: string) => await repository.readNotifications(userId)

    const deleteNotification = async (senderId: string, receiverId: string, event: string, postId?: string) => await repository.deleteNotification({ senderId, receiverId, event, postId })

    return {
        createNotification,
        getNotifications,
        readNotifications,
        deleteNotification
    }

}

export type NotificationDbInterface = typeof notificationDbRepository