import { Router } from "express"
import { chatRepositoryMongoDb } from "../../database/monogDB/repositories/chatRepositoryMongoDb"
import { chatDbRepository } from "../../../application/repositories/chatDbRepository"
import authMiddleware from "../middlewares/authMiddleware"
import { messageRepositoryMongoDb } from "../../database/monogDB/repositories/messageRepositoryMongoDb"
import { messageDbRepository } from "../../../application/repositories/messageDbRepository"
import messageController from "../../../adapters/messageController"

const messageRouter=()=>{
    const router=Router()

    const controller=messageController(
        chatRepositoryMongoDb,
        chatDbRepository,
        messageRepositoryMongoDb,
        messageDbRepository
    );

    router.post('/sendMessage',authMiddleware,controller.sendMessage)
    router.post('/getFullMessagesFromChat',authMiddleware,controller.getAllMessagesFromChat)

    return router
}

export default messageRouter