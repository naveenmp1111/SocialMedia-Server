import { ProfileInterface } from "../../../types/ProfileInterface";
import { UserDbInterface } from "../../repositories/userDbRepository";
import AppError from "../../../utils/appError";
import { HttpStatus } from "../../../types/httpStatus";

export const handleEditProfile = async (
  profileInfo: ProfileInterface,
  dbUserRepository: ReturnType<UserDbInterface>
) => {

  const usernameExists = await dbUserRepository.checkUsernameForEdit(profileInfo.username, profileInfo.userId)
  if (usernameExists) {
    throw new AppError('Username already exists', HttpStatus.UNAUTHORIZED)
  }
  const emailExists = await dbUserRepository.checkEmailForEdit(profileInfo.email, profileInfo.userId)
  if (emailExists) {
    throw new AppError('Email already exists', HttpStatus.UNAUTHORIZED)
  }

  const userDetails = await dbUserRepository.editProfile(profileInfo);
  return userDetails

};

export const handleGetUserByUsername = async (
  username: string,
  dbUserRepository: ReturnType<UserDbInterface>
) => {
  const userData = await dbUserRepository.getUserByUsername(username)
  return userData
}

