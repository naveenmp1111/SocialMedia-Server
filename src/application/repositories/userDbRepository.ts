import { UserRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/userRepositoryMongoDb";

import { GoogleUserInterface, UserInterface } from "../../types/LoginUserInterface";
import { ProfileInterface } from "../../types/ProfileInterface";

export const userDbRepository = (repository: ReturnType<UserRepositoryMongoDb>) => {

   const addUser = async (user: UserInterface | GoogleUserInterface) => await repository.addUser(user)

   const getUserByEmail = async (email: string) => await repository.getUserByEmail(email)

   const getUserByUsername = async (username: string) => await repository.getUserByUsername(username)

   const addRefreshTokenAndExpiry = async (email: string, refreshToken: string) => await repository.addRefreshTokenAndExpiry(email, refreshToken)

   const editProfile = async (profileInfo: ProfileInterface) => await repository.editProfile(profileInfo);

   const checkUsernameForEdit = async (username: string, userId: string) => await repository.checkUsernameForEdit(username, userId)

   const checkEmailForEdit = async (email: string, userId: string) => await repository.checkEmailForEdit(email, userId)

   const getAllUsersForAdmin = async () => await repository.getAllUsersForAdmin()

   const blockUser = async (userId: string) => await repository.blockUser(userId)

   const unblockUser = async (userId: string) => await repository.unBlockUser(userId)

   const getUserById = async (userId: string) => await repository.getUserById(userId)

   const updatePost = async (userId: string, postId: string) => await repository.updatePosts(userId, postId)

   const resetPassword = async (email: string, password: string) => await repository.resetPassword(email, password)

   const getRestOfAllUsers = async (userId: string) => await repository.getRestOfAllUsers(userId)

   const getSuggestedUsers = async (userId: string) => await repository.getSuggestedUsers(userId)

   const followUser = async (userId: string, friendusername: string) => await repository.followUser(userId, friendusername)

   const unfollowUser = async (userId: string, friendusername: string) => await repository.unfollowUser(userId, friendusername)

   const getFollowers = async (username: string) => await repository.getFollowers(username)

   const getFollowing = async (username: string) => await repository.getFollowing(username)

   const getRequests = async (username: string) => await repository.getRequests(username)

   const acceptRequest = async (userId: string, friendUsername: string) => await repository.acceptRequest(userId, friendUsername)

   const removeFollower = async (userId: string, friendUsername: string) => await repository.removeFollower(userId, friendUsername)

   const savePost = async (userId: string, postId: string) => await repository.savePost(postId, userId)

   const unsavePost = async (userId: string, postId: string) => await repository.unsavePost(postId, userId)

   const getSavedPosts = async (userId: string) => await repository.getSavedPosts(userId)

   const cancelRequest = async (userId: string, friendUsername: string) => await repository.cancelRequest(userId, friendUsername)

   const declineRequest = async (userId: string, friendUsername: string) => await repository.declineRequest(userId, friendUsername)

   const blockUserByUsername = async (userId: string, username: string) => await repository.blockUserByUsername(userId, username)

   const unblockUserByUsername = async (userId: string, username: string) => await repository.unblockUserByUsername(userId, username)

   const getBlockedUsers = async (userId: string) => await repository.getBlockedUsers(userId)


   return {
      addUser,
      getUserByEmail,
      getUserByUsername,
      addRefreshTokenAndExpiry,
      editProfile,
      checkUsernameForEdit,
      checkEmailForEdit,
      getAllUsersForAdmin,
      blockUser,
      unblockUser,
      getUserById,
      updatePost,
      resetPassword,
      getRestOfAllUsers,
      getSuggestedUsers,
      followUser,
      unfollowUser,
      getFollowing,
      getFollowers,
      getRequests,
      acceptRequest,
      removeFollower,
      savePost,
      unsavePost,
      getSavedPosts,
      cancelRequest,
      declineRequest,
      blockUserByUsername,
      unblockUserByUsername,
      getBlockedUsers
   }
}

export type UserDbInterface = typeof userDbRepository;