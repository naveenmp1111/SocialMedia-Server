import { AuthServiceReturn } from "../../frameworks/services/authService";

 export const authServiceInterface=(service:AuthServiceReturn)=>{

    const encryptPassword=async (password:string)=>{
        return await service.encryptPassword(password)
    }

    const comparePassword=async(password:string,hashedPassword:string)=>{
        return await service.comparePassword(password,hashedPassword)
    }

    return {
        encryptPassword,
        comparePassword
    }
}

export type AuthServiceInterface= typeof authServiceInterface