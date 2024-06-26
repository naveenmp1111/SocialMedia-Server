import { Request, Response, response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { handleAddComment, handleAddReply, handleCreatePost, handleDeletePost, handleEditPostbyId, handleGetAllPosts, handleGetComments, handleGetPostReports, handleGetPostsByUser, handleLikePost, handleReportPost, handleUnlikePost } from '../../application/user-cases/post/postAuth';
import { PostRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/postRepositoryMongoDb';
import { PostDbInterface } from '../../application/repositories/postDbRepository';
import {CommentDbInterface} from '../../application/repositories/commentDbRepository'
import { PostDataInterface } from '../../types/PostInterface';
import { CommentRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/commentRepostitoryMongoDb';


const postController = (
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface,
    authServiceImpl: AuthService,
    authServiceInterface: AuthServiceInterface,
    postDbRepositoryImpl:PostRepositoryMongoDb,
    postDbRepositoryInterface:PostDbInterface,
    commentDbRepositoryImpl:CommentRepositoryMongoDb,
    commentDbrepositoryInterface:CommentDbInterface
  ) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbPostRepository =postDbRepositoryInterface(postDbRepositoryImpl())
    const dbCommentRepository=commentDbrepositoryInterface(commentDbRepositoryImpl())
  
    const createPost = asyncHandler(async (req: Request, res: Response) => {
      const postData: PostDataInterface = req.body;
      // console.log('body data',req.body)
      const post = await handleCreatePost(postData,dbPostRepository);
      res.json({
        status: "success",
        message: "Post created successfully",
        post
      });
    });

    const getPostsByUser=asyncHandler(async(req:Request,res:Response)=>{
      const {username}=req.params
      const UserPosts=await handleGetPostsByUser(username,dbPostRepository)
      res.json({
        status:'success',
        message:'My posts fetched successfully',
        posts:UserPosts
      })
    })

    const updatePostById=asyncHandler(async(req:Request,res:Response)=>{
      const {postId,description}=req.body
      const updatedPost=await handleEditPostbyId(postId,description,dbPostRepository)
      res.json({
        status:'success',
        message:'Post updated successfully',
        post:updatedPost
      })
    })

    const getAllPosts=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const posts=await handleGetAllPosts(userId,dbPostRepository)
      res.json({
        status:'success',
        message:'Posts fetched successfully',
        posts
      })
    })

    const deletePost=asyncHandler(async(req:Request,res:Response)=>{
      const {postId}=req.params
      const post=await handleDeletePost(postId,dbPostRepository)
      res.json({
        status:'success',
        message:'Post deleted successfully'
      })
    })

    const reportPost=asyncHandler(async(req:Request,res:Response)=>{
      const {userId,postId,reason}=req.body
      await handleReportPost(postId,reason,userId,dbPostRepository)
      res.json({
        status:'success',
        message:'Report submitted successfully'
      })
    })

    const likePost=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {postId}=req.params
      console.log('coming in like controller')
      await handleLikePost(postId,userId,dbPostRepository)
      res.json({
        status:'success',
        message:'Post liked successfully'
      })
    })

    const unlikePost=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const {postId}=req.params
      console.log('wooo',userId,postId)
      await handleUnlikePost(postId,userId,dbPostRepository)
      res.json({
        status:'success',
        message:'Post unliked successfully'
      })
    })

    const addComment=asyncHandler(async(req:Request,res:Response)=>{
      const {userId,postId,comment}=req.body
      // console.log('comment data is ',userId ,postId ,comment)
     const response= await handleAddComment(userId,postId,comment,dbCommentRepository)
      res.json({
        status:'success',
        message:'Comment added successfully',
        comment:response
      })
    })

    const addReply=asyncHandler(async(req:Request,res:Response)=>{
      const {userId,postId,comment,parentId}=req.body
      // console.log('comment data is ',userId ,postId ,comment)
     const response= await handleAddReply(userId,postId,parentId,comment,dbCommentRepository)
      res.json({
        status:'success',
        message:'Comment added successfully',
        comment:response
      })
    })

    const getComments=asyncHandler(async(req:Request,res:Response)=>{
      const {postId}=req.params
      const comments=await handleGetComments(postId,dbCommentRepository)
      res.json({
        status:'success',
        message:'Comments fetched successfuly',
        comments
      })
    })

  
    return {
        createPost,
        getPostsByUser,
        updatePostById,
        getAllPosts,
        deletePost,
        reportPost,
        likePost,
        unlikePost,
        addComment,
        getComments,
        addReply
    }
  }
  
  export default postController