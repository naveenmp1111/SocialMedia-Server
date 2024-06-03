import { Application,Router } from "express";
import authRouter from "./auth";
import profileRouter from "./profile";
import adminRouter from "./admin";

const routes=(app:Application)=>{
    app.use('/api/auth',authRouter())
    app.use('/api/profile',profileRouter())
    app.use('/api/admin',adminRouter())
}

export default routes