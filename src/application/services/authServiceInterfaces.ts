import { AuthServiceReturn } from "../../frameworks/services/authService";

export const authServiceInterface = (service: AuthServiceReturn) => {

    const encryptPassword = async (password: string) => {
        return await service.encryptPassword(password)
    }

    const comparePassword = async (password: string, hashedPassword: string) => {
        return await service.comparePassword(password, hashedPassword)
    }

    const generateAccessToken = async (userId: string, role: string) => {
        // console.log('coming to generate accesstoken')
        return await service.generateAccessToken({ userId, role })
    }

    const generateRefreshToken = async (userId: string, role: string) => {
        // console.log('coing to authSeriveceinterfaces')
        return await service.generateRefreshToken({ userId, role })
    }

    const verifyAccessToken = (token: string) => {
        return service.verifyAccessToken(token);
    }

    const verifyRefreshToken = (token: string) => {
        return service.verifyRefreshToken(token);
    }

    return {
        encryptPassword,
        comparePassword,
        generateAccessToken,
        generateRefreshToken,
        verifyAccessToken,
        verifyRefreshToken
    }
}

export type AuthServiceInterface = typeof authServiceInterface