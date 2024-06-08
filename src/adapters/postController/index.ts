import { Request, Response, response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { handleCreatePost, handleDeletePost, handleEditPostbyId, handleGetAllPosts, handleGetMyPosts } from '../../application/user-cases/post/postAuth';
import { PostRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/postRepositoryMongoDb';
import { PostDbInterface } from '../../application/repositories/postDbRepository';
import { PostDataInterface } from '../../types/PostInterface';


const postController = (
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface,
    authServiceImpl: AuthService,
    authServiceInterface: AuthServiceInterface,
    postDbRepositoryImpl:PostRepositoryMongoDb,
    postDbRepositoryInterface:PostDbInterface
  ) => {
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbPostRepository =postDbRepositoryInterface(postDbRepositoryImpl())
  
    const createPost = asyncHandler(async (req: Request, res: Response) => {
      const postData: PostDataInterface = req.body;
      // console.log('body data',req.body)
      const post = await handleCreatePost(postData,dbPostRepository, dbUserRepository);
      res.json({
        status: "success",
        message: "Post created successfully",
        post
      });
    });

    const getMyPosts=asyncHandler(async(req:Request,res:Response)=>{
      const {userId}=req.body
      const myPosts=await handleGetMyPosts(userId,dbPostRepository)
      res.json({
        status:'success',
        message:'My posts fetched successfully',
        posts:myPosts
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
  
    return {
        createPost,
        getMyPosts,
        updatePostById,
        getAllPosts,
        deletePost
    }
  }
  
  export default postController