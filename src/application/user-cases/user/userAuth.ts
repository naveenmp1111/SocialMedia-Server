
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