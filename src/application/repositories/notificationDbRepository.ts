import { NotificationRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/notificationRepositoryMongoDb"

export const notificationDbRepository=(repository:ReturnType<NotificationRepositoryMongoDb>)=>{

    const createNotification=async(senderId:string,receiverId:string,event:string)=>await repository.createNotification({senderId,receiverId,event})

    const getNotifications=async(receiverId:string)=>await repository.getNotifications(receiverId)

    const readNotifications=async(notificationId:string)=>await repository.readNotifications(notificationId)

    return {
        createNotification,
        getNotifications,
        readNotifications 
    }

}

export type MessageDbInterface=typeof notificationDbRepository