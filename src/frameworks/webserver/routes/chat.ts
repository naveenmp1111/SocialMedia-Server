import { Router } from "express"
import { chatRepositoryMongoDb } from "../../database/monogDB/repositories/chatRepositoryMongoDb"
import { chatDbRepository } from "../../../application/repositories/chatDbRepository"
import chatController from "../../../adapters/chatController"
import authMiddleware from "../middlewares/authMiddleware"

const chatRouter=()=>{
    const router=Router()

    const controller=chatController(
        chatRepositoryMongoDb,
        chatDbRepository
    );

    router.post('/createOrAccessChat',authMiddleware,controller.createOrAccessChat)
    router.get('/fetchChats',authMiddleware,controller.fetchChats)

    return router
}

export default chatRouter