import { Request, Response, response } from 'express';
import asyncHandler from 'express-async-handler'
import { AuthService } from '../../frameworks/services/authService';
import { AuthServiceInterface } from '../../application/services/authServiceInterfaces';
import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';
import { handleAddComment, handleAddReply, handleCreatePost, handleDeletePost, handleEditPostbyId, handleGetAllPosts, handleGetAllPostsToExplore, handleGetComments, handleGetPostReports, handleGetPostsByUser, handleGetTaggedPosts, handleLikePost, handleReportPost, handleUnlikePost } from '../../application/user-cases/post/postAuth';
import { PostRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/postRepositoryMongoDb';
import { PostDbInterface } from '../../application/repositories/postDbRepository';
import { CommentDbInterface } from '../../application/repositories/commentDbRepository'
import { PostDataInterface } from '../../types/PostInterface';
import { CommentRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/commentRepostitoryMongoDb';
import { NotificationRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/notificationRepositoryMongoDb';
import { NotificationDbInterface } from '../../application/repositories/notificationDbRepository';


const postController = (
  userDbRepositoryImpl: UserRepositoryMongoDb,
  userDbRepositoryInterface: UserDbInterface,
  authServiceImpl: AuthService,
  authServiceInterface: AuthServiceInterface,
  postDbRepositoryImpl: PostRepositoryMongoDb,
  postDbRepositoryInterface: PostDbInterface,
  commentDbRepositoryImpl: CommentRepositoryMongoDb,
  commentDbrepositoryInterface: CommentDbInterface,
  notificationDbRepositoryImpl: NotificationRepositoryMongoDb,
  notificationDbRepositoryInterface: NotificationDbInterface,
) => {
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());
  const dbPostRepository = postDbRepositoryInterface(postDbRepositoryImpl())
  const dbCommentRepository = commentDbrepositoryInterface(commentDbRepositoryImpl())
  const dbNotificationRepository = notificationDbRepositoryInterface(notificationDbRepositoryImpl())

  const createPost = asyncHandler(async (req: Request, res: Response) => {
    const postData: PostDataInterface = req.body;
    const post = await handleCreatePost(postData, dbPostRepository);
    res.json({
      status: "success",
      message: "Post created successfully",
      post
    });
  });

  const getPostsByUser = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params
    const UserPosts = await handleGetPostsByUser(username, dbPostRepository)
    res.json({
      status: 'success',
      message: 'My posts fetched successfully',
      posts: UserPosts
    })
  })

  const updatePostById = asyncHandler(async (req: Request, res: Response) => {
    const { postId, description } = req.body
    const updatedPost = await handleEditPostbyId(postId, description, dbPostRepository)
    res.json({
      status: 'success',
      message: 'Post updated successfully',
      post: updatedPost
    })
  })

  const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const posts = await handleGetAllPosts(userId, dbPostRepository)
    res.json({
      status: 'success',
      message: 'Posts fetched successfully',
      posts
    })
  })

  const getAllPostsToExplore = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const posts = await handleGetAllPostsToExplore(userId, dbPostRepository)
    res.json({
      status: 'success',
      message: 'Posts fetched successfully',
      posts
    })
  })

  const deletePost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params
    const post = await handleDeletePost(postId, dbPostRepository)
    res.json({
      status: 'success',
      message: 'Post deleted successfully'
    })
  })

  const reportPost = asyncHandler(async (req: Request, res: Response) => {
    const { userId, postId, reason } = req.body
    await handleReportPost(postId, reason, userId, dbPostRepository)
    res.json({
      status: 'success',
      message: 'Report submitted successfully'
    })
  })

  const likePost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { postId } = req.params
    await handleLikePost(postId, userId, dbPostRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Post liked successfully'
    })
  })

  const unlikePost = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body
    const { postId } = req.params
    await handleUnlikePost(postId, userId, dbPostRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Post unliked successfully'
    })
  })

  const addComment = asyncHandler(async (req: Request, res: Response) => {
    const { userId, postId, comment } = req.body
    const response = await handleAddComment(userId, postId, comment, dbCommentRepository, dbPostRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Comment added successfully',
      comment: response
    })
  })

  const addReply = asyncHandler(async (req: Request, res: Response) => {
    const { userId, postId, comment, parentId } = req.body
    const response = await handleAddReply(userId, postId, parentId, comment, dbCommentRepository, dbPostRepository, dbNotificationRepository)
    res.json({
      status: 'success',
      message: 'Comment added successfully',
      comment: response
    })
  })

  const getComments = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params
    const comments = await handleGetComments(postId, dbCommentRepository)
    res.json({
      status: 'success',
      message: 'Comments fetched successfuly',
      comments
    })
  })

  const getTaggedPosts = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params
    const taggedPosts = await handleGetTaggedPosts(username, dbPostRepository)
    res.json({
      status: 'success',
      message: 'taggedposts fetched successfull',
      posts: taggedPosts
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
    addReply,
    getAllPostsToExplore,
    getTaggedPosts,
  }
}

export default postController