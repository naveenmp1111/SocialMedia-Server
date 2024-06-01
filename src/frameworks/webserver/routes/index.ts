import { Application,Router } from "express";
import authRouter from "./auth";
import profileRouter from "./profile";

const routes=(app:Application)=>{
    app.use('/api/auth',authRouter())
    app.use('/api/profile',profileRouter())
}

export default routes