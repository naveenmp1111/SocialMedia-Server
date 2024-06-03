import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterfaces";
import AppError from "../../../utils/appError"; 
import { HttpStatus } from "../../../types/httpStatus";


export const handleGetAllUsersForAdmin=async(
    dbUserRepository:ReturnType<UserDbInterface>
)=>{
    const users=dbUserRepository.getAllUsersForAdmin()
    return users
}

export const handleBlockUser=async(
    userId:string,
    dbUserRepository:ReturnType<UserDbInterface>
)=>{
    console.log('useridddd ',userId)
    const userData=dbUserRepository.blockUser(userId)
    return userData
}

export const handleUnblockUser=async(
    userId:string,
    dbUserRepository:ReturnType<UserDbInterface>
)=>{
    const userData=dbUserRepository.unblockUser(userId)
    return userData
}