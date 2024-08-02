import { PostDbInterface, postDbRepository } from "../../repositories/postDbRepository";
import { UserDbInterface } from "../../repositories/userDbRepository";
import { MailSenderServiceInterface } from "../../services/mailSenderService";


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
    dbPostRepository: ReturnType<PostDbInterface>,
    dbUserRepository:ReturnType<UserDbInterface>,
    mailSenderService: ReturnType<MailSenderServiceInterface>,
) => {
    const postData =await dbPostRepository.blockPost(postId)
    console.log('postData while blockiing is ',)
    //@ts-ignore
    const userData=await dbUserRepository.getUserById(postData.userId)
    console.log('userData while blocking post is ',userData)
    //@ts-ignore
    await mailSenderService.sendPostBlockNotification(userData.email,postData.image[0])
    return postData
}

export const handleUnblockPost = async (
    postId: string,
    dbPostRepository: ReturnType<PostDbInterface>
) => {
    const userData = dbPostRepository.unblockPost(postId)
    return userData
}

export const handleGetWeeklyData = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        return await postDbRepository.getWeeklyData()
    } catch (error) {
        console.log('error in getting weekly data ', error)
    }
}

export const handleGetMonthlyData = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        return await postDbRepository.getMonthlyData()
    } catch (error) {
        console.log('error in getting monthly data')
    }
}

export const handleGetYearlyData = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        return await postDbRepository.getYearlyData()
    } catch (error) {
        console.log('error in getting yearly data', error)
    }
}

export const handleGetAllPostsForAdmin = async (
    postDbRepository: ReturnType<PostDbInterface>
) => {
    try {
        return await postDbRepository.getAllPostsForAdmin()
    } catch (error) {
        console.log('error in gettig all posts for admin ', error)
    }
}