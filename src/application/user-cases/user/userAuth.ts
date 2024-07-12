
import { UserDbInterface } from "../../repositories/userDbRepository";
import AppError from "../../../utils/appError";
import { HttpStatus } from "../../../types/httpStatus";

export const handleGetRestOfAllUsers = async (
 userId:string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {

  const users = await dbUserRepository.getRestOfAllUsers(userId)
  return users

};

export const handleGetSuggestedUsers = async (
 userId:string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {

  const users = await dbUserRepository.getSuggestedUsers(userId)
  return users

};

export const handleFollowUser=async(
  userId:string,
  friendusername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  try {
    await dbUserRepository.followUser(userId,friendusername)
  } catch (error) {
    console.log(error)
    throw new AppError('no user found',HttpStatus.UNAUTHORIZED)
  }
  
}

export const handleUnfollowUser=async(
  userId:string,
  friendusername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  const users=await dbUserRepository.unfollowUser(userId,friendusername)
  return users
}

export const handleRemoveFollower=async(
  userId:string,
  friendUsername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  await dbUserRepository.removeFollower(userId,friendUsername)
}

export const handleGetFollowing=async(
  friendusername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  const users=await dbUserRepository.getFollowing(friendusername)
  return users
}

export const handleGetFollowers=async(
  friendusername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  const users=await dbUserRepository.getFollowers(friendusername)
  return users
}

export const handleGetRequests=async(
  username:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  const requestedUsers=await dbUserRepository.getRequests(username)
  return requestedUsers
}

export const handleAcceptRequest=async(
  userId:string,
  friendUsername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  await dbUserRepository.acceptRequest(userId,friendUsername)
}

export const handleSavePost=async(
  userId:string,
  postId:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  await dbUserRepository.savePost(userId,postId)
}

export const handleUnsavePost=async(
  userId:string,
  postId:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  await dbUserRepository.unsavePost(userId,postId)
}

export const handleGetSavedPosts=async(
  userId:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
 return await dbUserRepository.getSavedPosts(userId)
}

export const handleCancelRequest=async(
  userId:string,
  friendUsername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  return await dbUserRepository.cancelRequest(userId,friendUsername)
}

export const handleDeclineRequest=async(
  userId:string,
  friendsUsername:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  return await dbUserRepository.declineRequest(userId,friendsUsername)
}

export const handleBlockUserByUsername=async(
  userId:string,
  username:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
   const response=await dbUserRepository.blockUserByUsername(userId,username)
  await dbUserRepository.removeFollower(userId,username) 
  await dbUserRepository.unfollowUser(userId,username)
  return response
}

export const handleUnblockUserByUsername=async(
  userId:string,
  username:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  try {
    return await dbUserRepository.unblockUserByUsername(userId,username)
   
  } catch (error) {
    console.log(error)
    throw new AppError('error in blockUser',HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

export const handleGetBlockedUsers=async(
  userId:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  return await dbUserRepository.getBlockedUsers(userId)
}