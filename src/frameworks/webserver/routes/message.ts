import { Router } from "express"
import { chatRepositoryMongoDb } from "../../database/monogDB/repositories/chatRepositoryMongoDb"
import { chatDbRepository } from "../../../application/repositories/chatDbRepository"
import authMiddleware from "../middlewares/authMiddleware"
import { messageRepositoryMongoDb } from "../../database/monogDB/repositories/messageRepositoryMongoDb"
import { messageDbRepository } from "../../../application/repositories/messageDbRepository"
import messageController from "../../../adapters/messageController"

const messageRouter = () => {
    const router = Router()

    const controller = messageController(
        chatRepositoryMongoDb,
        chatDbRepository,
        messageRepositoryMongoDb,
        messageDbRepository
    );

    router.post('/sendMessage', authMiddleware, controller.sendMessage)
    router.post('/getFullMessagesFromChat', authMiddleware, controller.getAllMessagesFromChat)
    router.post('/getUnreadMessagesFromChat', authMiddleware, controller.getUnreadMessagesFromChat)
    router.patch('/setUnreadMessagesRead', authMiddleware, controller.setUnreadMessagesRead)
    router.patch('/deleteMessage', authMiddleware, controller.deleteMessage)
    router.patch('/deleteMessageForMe', authMiddleware, controller.deleteMessageForMe),
        router.get('/getAllUnreadMessages', authMiddleware, controller.getAllUnreadMessages)

    return router
}

export default messageRouter