import { Request, Response } from 'express';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import asyncHandler from 'express-async-handler';
import { handleAcceptRequest, handleBlockUserByUsername, handleCancelRequest, handleDeclineRequest, handleFollowUser, handleGetBlockedUsers, handleGetFollowers, handleGetFollowing, handleGetRequests, handleGetRestOfAllUsers, handleGetSavedPosts, handleGetSuggestedUsers, handleRemoveFollower, handleSavePost, handleUnblockUserByUsername, handleUnfollowUser, handleUnsavePost } from '../../application/user-cases/user/userAuth';
import { NotificationRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/notificationRepositoryMongoDb';
import { NotificationDbInterface } from '../../application/repositories/notificationDbRepository';



const userController = (
  userDbRepositoryImpl: UserRepositoryMongoDb,
  userDbRepositoryInterface: UserDbInterface,
  notificationDbRepositoryImpl: NotificationRepositoryMongoDb,
  notificationDbRepositoryInterface: NotificationDbInterface,
) => {

  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const dbNotificationRepository = notificationDbRepositoryInterface(notificationDbRepositoryImpl())

  const getRestOfAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const users = await handleGetRestOfAllUsers(userId, dbUserRepository);
    res.json({
      users
    });
  });

  const getSuggestedUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const users = await handleGetSuggestedUsers(userId, dbUserRepository);
    res.json({
      users
    });
  });

  const followUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendUsername } = req.body
    const userData = await handleFollowUser(userId, friendUsername, dbUserRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Following successfull',
    })
  })

  const unfollowUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendUsername } = req.body
    const userData = await handleUnfollowUser(userId, friendUsername, dbUserRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Unfollowed successfully',
    })
  })

  const removeFollower = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { followerUsername } = req.params
    await handleRemoveFollower(userId, followerUsername, dbUserRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Follower removed successfully'
    })
  })

  const getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const users = await handleGetFollowing(userId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Following fetched successfully',
      users: users
    })
  })

  const getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params
    const users = await handleGetFollowers(userId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Followers fetched successfully',
      users: users
    })
  })

  const getRequests = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params
    const requestedUsers = await handleGetRequests(username, dbUserRepository)
    res.json({
      status: 'success',
      message: 'user requests fetched successfully',
      users: requestedUsers
    })
  })

  const acceptRequest = asyncHandler(async (req: Request, res: Response) => {
    const { userId, friendUsername } = req.body
    await handleAcceptRequest(userId, friendUsername, dbUserRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Request accepted successfully'
    })
  })

  const savePost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { postId } = req.params
    await handleSavePost(userId, postId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Post saved successfully'
    })
  })

  const unsavePost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { postId } = req.params
    await handleUnsavePost(userId, postId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Post unsaved successfully'
    })
  })

  const getSavedPosts = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const savedPosts = await handleGetSavedPosts(userId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Saved Posts fetched successfully',
      posts: savedPosts
    })
  })

  const cancelRequest = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { friendUsername } = req.params
    await handleCancelRequest(userId, friendUsername, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Request cancelled successfully'
    })
  })

  const declineRequest = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { friendUsername } = req.params
    await handleDeclineRequest(userId, friendUsername, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Request declined successfully'
    })
  })

  const blockUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { username } = req.params
    await handleBlockUserByUsername(userId, username, dbUserRepository)
    res.json({
      status: 'sucdess',
      message: 'User blocked successfully'
    })
  })

  const unblockUserByUsername = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { username } = req.params
    await handleUnblockUserByUsername(userId, username, dbUserRepository)
    res.json({
      status: 'sucdess',
      message: 'User unblocked successfully'
    })
  })

  const getBlockedUsers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const blockedUsers = await handleGetBlockedUsers(userId, dbUserRepository)
    res.json({
      status: 'success',
      message: 'Fetched blocked Users successfully',
      users: blockedUsers
    })
  })

  return {
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

export default userController