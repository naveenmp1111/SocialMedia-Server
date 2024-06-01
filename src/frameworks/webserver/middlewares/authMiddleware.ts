import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../../database/monogDB/models/userModel'
import { HttpStatus } from '../../../types/httpStatus'
import configKeys from '../../../config'
import { NextFunction,Request,Response } from 'express'


const authMiddleware=async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try {
        let token=req.header('authorization')?.split(' ')[1]
        token=token?.replace('"',' ')
        if(token){
            const decryptedToken=jwt.verify(token,configKeys.JWT_ACCESS_SECRET) as JwtPayload
            console.log('decryted token',decryptedToken)
            const user=await User.findOne({_id:decryptedToken.userId,isBlock:true})
            req.body.userId=decryptedToken.userId
            if(user && req.path!='/logout'){
                res.status(HttpStatus.UNAUTHORIZED).json({success:false,message:'User is blocked'})
            }else{
                next()
            }
        }else{
            res.status(HttpStatus.UNAUTHORIZED).json({success:false,message:'Token not found'})
        }
    } catch (error:any) {
        res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: error.message });
    }
}

export default authMiddleware