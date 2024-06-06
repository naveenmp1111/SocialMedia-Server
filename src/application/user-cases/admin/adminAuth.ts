import { UserDbInterface } from "../../repositories/userDbRepository";


export const handleGetAllUsersForAdmin = async (
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    const users = dbUserRepository.getAllUsersForAdmin()
    return users
}

export const handleBlockUser = async (
    userId: string,
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    const userData = dbUserRepository.blockUser(userId)
    return userData
}

export const handleUnblockUser = async (
    userId: string,
    dbUserRepository: ReturnType<UserDbInterface>
) => {
    const userData = dbUserRepository.unblockUser(userId)
    return userData
}