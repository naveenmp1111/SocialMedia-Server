import { Request, Response, response } from 'express';

import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';

import asyncHandler from 'express-async-handler';
import { handleAcceptRequest, handleFollowUser, handleGetFollowers, handleGetFollowing, handleGetRequests, handleGetRestOfAllUsers, handleRemoveFollower, handleSavePost, handleUnfollowUser, handleUnsavePost } from '../../application/user-cases/user/userAuth';



const userController = (
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface
  ) => {
    
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  
    const getRestOfAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const {userId}=req.body
      const users = await handleGetRestOfAllUsers(userId,dbUserRepository);
      res.json({
        users
      });
    });

    const followUser = asyncHandler(async(req:Request, res:Response)=>{
      const {userId,friendUsername}=req.body
      console.log('userId is ',userId)
      // console.log('friendId is ',friendId)
     const userData= await handleFollowUser(userId,friendUsername,dbUserRepository)
      res.json({
        status:'success',
        message:'Following successfull',
      })
    })

    const unfollowUser=asyncHandler(async(req:Request,res:Response)=>{
      const {userId,friendUsername}=req.body
      console.log('userid is ',userId,friendUsername)
      const userData=await handleUnfollowUser(userId,friendUsername,dbUserRepository)
      res.json({
        status:'success',
        message:'Unfollowed successfully',
      })
    })

    const removeFollower=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {followerUsername}=req.params
      await handleRemoveFollower(userId,followerUsername,dbUserRepository)
      res.json({
        status:'success',
        message:'Follower removed successfully'
      })
    })

    const getFollowing=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.params
      const users=await handleGetFollowing(userId,dbUserRepository)
      res.json({
        status:'success',
        message:'Following fetched successfully',
        users:users
      })
    })

    const getFollowers=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.params
      const users=await handleGetFollowers(userId,dbUserRepository)
      res.json({
        status:'success',
        message:'Followers fetched successfully',
        users:users
      })
    })

    const getRequests=asyncHandler(async(req:Request,res:Response)=>{
      const {username}=req.params
      const requestedUsers=await handleGetRequests(username,dbUserRepository)
      res.json({
        status:'success',
        message:'user requests fetched successfully',
        users:requestedUsers
      })
    })

    const acceptRequest=asyncHandler(async(req:Request,res:Response)=>{
      const {userId,friendUsername}=req.body
      await handleAcceptRequest(userId,friendUsername,dbUserRepository)
      res.json({
        status:'success',
        message:'Request accepted successfully'
      })
    })

    const savePost=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {postId}=req.params
      await handleSavePost(userId,postId,dbUserRepository)
      res.json({
        status:'success',
        message:'Post saved successfully'
      })
    })

    const unsavePost=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {postId}=req.params
      await handleUnsavePost(userId,postId,dbUserRepository)
      res.json({
        status:'success',
        message:'Post unsaved successfully'
      })
    })

    return{ 
        getRestOfAllUsers,
        followUser,
        unfollowUser,
        getFollowing,
        getFollowers,
        getRequests,
        acceptRequest,
        removeFollower,
        savePost,
        unsavePost
    }
  }

  export default userController