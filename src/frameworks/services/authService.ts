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

    return {
        encryptPassword,
        comparePassword
    }
}

export type AuthService=typeof authService;
export type AuthServiceReturn= ReturnType<AuthService>