import { Application, Router } from "express";
import authRouter from "./auth";
import profileRouter from "./profile";
import adminRouter from "./admin";
import postRouter from "./post";
import userRouter from "./user"

const routes = (app: Application) => {
    app.use('/api/auth', authRouter())
    app.use('/api/profile', profileRouter())
    app.use('/api/admin', adminRouter())
    app.use('/api/post',postRouter())
    app.use('/api/user',userRouter())
}

export default routes