import { Router } from "express"
import authMiddleware from "../middlewares/authMiddleware"
import notificationController from "../../../adapters/notificationController"
import { notificationDbRepository } from "../../../application/repositories/notificationDbRepository"
import { notficationRepositoryMongoDb } from "../../database/monogDB/repositories/notificationRepositoryMongoDb"

const notificationRouter = () => {
    const router = Router()

    const controller = notificationController(
        notficationRepositoryMongoDb,
        notificationDbRepository
    );

    router.get('/getNotifications', authMiddleware, controller.getNotifications)
    router.patch('/readNotifications', authMiddleware, controller.readNotifications)

    return router
}

export default notificationRouter