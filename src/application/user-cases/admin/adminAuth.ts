import { PostDbInterface, postDbRepository } from "../../repositories/postDbRepository";
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

export const handleBlockPost = async (
    postId: string,
    dbPostRepository: ReturnType<PostDbInterface>
) => {
    const userData = dbPostRepository.blockPost(postId)
    return userData
}

export const handleUnblockPost = async (
    postId: string,
    dbPostRepository: ReturnType<PostDbInterface>
) => {
    const userData = dbPostRepository.unblockPost(postId)
    return userData
}

export const handleGetWeeklyData=async(
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        return await postDbRepository.getWeeklyData()
    } catch (error) {
        console.log('error in getting weekly data ',error)
    }
}

export const handleGetMonthlyData=async(
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        return await postDbRepository.getMonthlyData()
    } catch (error) {
        console.log('error in getting monthly data')
    }
}

export const handleGetYearlyData=async(
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        return await postDbRepository.getYearlyData()
    } catch (error) {
        console.log('error in getting yearly data',error)
    }
}

export const handleGetAllPostsForAdmin=async(
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        return await postDbRepository.getAllPostsForAdmin()
    } catch (error) {
        console.log('error in gettig all posts for admin ',error)
    }
}