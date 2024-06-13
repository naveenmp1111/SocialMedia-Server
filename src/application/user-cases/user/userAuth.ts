
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
  friendId:string,
  dbUserRepository:ReturnType<UserDbInterface>
)=>{
  const response=await dbUserRepository.followUser(userId,friendId)
}
