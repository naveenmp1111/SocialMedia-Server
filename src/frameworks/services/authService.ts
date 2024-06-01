import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import configKeys from '../../config';

export const authService=()=>{
    const encryptPassword=async(password:string)=>{
        const salt=await bcrypt.genSalt(10);
        password =await bcrypt.hash(password,salt)
        return password;
    }

    const comparePassword=async(password:string,hashedPassword:string)=>{
        return bcrypt.compare(password,hashedPassword)
    }

    const generateAccessToken=(payload:{userId:string;role:string})=>{
        console.log('coimg to accesstken generation')
        const accessToken=jwt.sign(payload,configKeys.JWT_ACCESS_SECRET,{
            expiresIn:'15m'
        })
        return accessToken
    }

    const generateRefreshToken=(payload:{userId:string;role:string})=>{
        console.log('coming to refresh token generations')
        const refreshToken=jwt.sign(payload,configKeys.JWT_REFRESH_SECRET,{
            expiresIn:'7d'
        })
        console.log('refreshtoken',refreshToken)
        return refreshToken
    }

    const verifyAccessToken=(token:string)=>{
        const payload:{userId:string,role:string}=jwt.verify(token,configKeys.JWT_ACCESS_SECRET) as {userId:string,role:string}
    }

    const verifyRefreshToken=(token:string)=>{
        const payload:{userId:string,role:string}=jwt.verify(token,configKeys.JWT_REFRESH_SECRET) as {userId:string,role:string}
    }

    return {
        encryptPassword,
        comparePassword,
        generateRefreshToken,
        generateAccessToken,
        verifyAccessToken,
        verifyRefreshToken
    }
}

export type AuthService=typeof authService;
export type AuthServiceReturn= ReturnType<AuthService>