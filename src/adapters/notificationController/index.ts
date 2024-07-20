import asyncHandler from "express-async-handler";
import { NotificationDbInterface } from "../../application/repositories/notificationDbRepository";
import { NotificationRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/notificationRepositoryMongoDb";
import { Request, Response } from "express";
import { handleGetNotifications, handleReadNotification } from "../../application/user-cases/notification/notificationAuth";

const notificationController = (
    notificationDbRepositoryImpl: NotificationRepositoryMongoDb,
    notificationDbRepositoryInterface: NotificationDbInterface,
  ) => {
    const dbNotificationRepository = notificationDbRepositoryInterface(notificationDbRepositoryImpl());


    const getNotifications=asyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.body;
        const notifications=await handleGetNotifications(userId,dbNotificationRepository)
        console.log('notifications are ',notifications)
        res.json({
            status:'success',
            message:'Notifications fetched successfully',
            notifications
        })
    })

    const readNotifications=asyncHandler(async(req:Request,res:Response)=>{
        const {userId}=req.body;
        await handleReadNotification(userId,dbNotificationRepository)
        res.json({
            status:'success',
            message:'made notifications read',
        })
    })
  
  
  
    return {
        getNotifications,
        readNotifications
    }
  }
  
  export default notificationController