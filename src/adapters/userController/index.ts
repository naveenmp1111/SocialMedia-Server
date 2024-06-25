import { Request, Response, response } from 'express';

import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';

import asyncHandler from 'express-async-handler';
import { handleAcceptRequest, handleCancelRequest, handleDeclineRequest, handleFollowUser, handleGetFollowers, handleGetFollowing, handleGetRequests, handleGetRestOfAllUsers, handleGetSavedPosts, handleRemoveFollower, handleSavePost, handleUnfollowUser, handleUnsavePost } from '../../application/user-cases/user/userAuth';



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

    const getSavedPosts=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const savedPosts=await handleGetSavedPosts(userId,dbUserRepository)
      res.json({
        status:'success',
        message:'Saved Posts fetched successfully',
        posts:savedPosts
      })
    })

    const cancelRequest=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {friendUsername}=req.params
      await handleCancelRequest(userId,friendUsername,dbUserRepository)
      res.json({
        status:'success',
        message:'Request cancelled successfully'
      })
    })

    const declineRequest=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {friendUsername}=req.params
      console.log('decline request data ',userId,friendUsername)
      await handleDeclineRequest(userId,friendUsername,dbUserRepository)
      res.json({
        status:'success',
        message:'Request declined successfully'
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
        unsavePost,
        getSavedPosts,
        cancelRequest,
        declineRequest
    }
  }

  export default userController