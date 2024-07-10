import { PostDataInterface } from "../../../types/PostInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { CommentDbInterface } from "../../repositories/commentDbRepository"
import { PostDbInterface, postDbRepository } from "../../repositories/postDbRepository"
import { UserDbInterface } from "../../repositories/userDbRepository"



export const handleCreatePost=async(
    postData:PostDataInterface,
    postDbRepository:ReturnType<PostDbInterface>,
    // userDbRepository:ReturnType<UserDbInterface>
)=>{
    try {
        const createdPost=await postDbRepository.createPost(postData)
        // console.log('checking created post id ',createdPost?._id)
        // if(createdPost){
        //     // console.log('post created successfully')
        //     const updatedUserdata=await userDbRepository.updatePost(
        //         postData.userId as string,
        //         createdPost._id as string
        //       );
        //     //   console.log('updated user ',updatedUserdata)
        // }
        return createdPost
    } catch (error) {
        console.log('Error creating in post',error)
        throw new AppError('Error creating in post',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetPostsByUser=async(
    username:string,
    postDbRepository:ReturnType<PostDbInterface>,
)=>{
    try {
        const UserPosts=await postDbRepository.getPostsByUser(username)
        return UserPosts
    } catch (error) {
        console.log('error in fetching my posts',error)
        throw new AppError('Error in fetching my posts ',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleEditPostbyId=async(
    postId:string,
    description:string,
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        const updatedPost=await postDbRepository.updatePostById(postId,description)
        return updatedPost
    } catch (error) {
        console.log('error in  handleEditPostbyId',error)
        throw new AppError('Error in handling the edit post',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetAllPosts=async(
    userId:string,
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    // try {
        // throw new AppError('error created', HttpStatus.UNAUTHORIZED)
        const allPosts=await postDbRepository.getAllPosts(userId)
        return allPosts
    // } catch (error) {
    //     console.log('errror in getting all posts',error)
    // }
}

export const handleGetAllPostsToExplore=async(
    userId:string,
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    const allposts=await postDbRepository.getAllPostsToExplore(userId)
    return allposts
}

export const handleDeletePost=async(
    postId:string,
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        const post=await postDbRepository.deletePost(postId)
        return post
    } catch (error) {
        console.log('errror in handleDeletePost ',error)
    }
}

export const handleReportPost=async(
    postId:string,
    reason:string,
    userId:string,
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        await postDbRepository.reportPost(postId,reason,userId)
    } catch (error) {
        console.log('error in report Post',error)
    }
}

export const handleGetPostReports=async(
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
       const reports= await postDbRepository.getPostReports()
       return reports
    } catch (error) {
        console.log('error in getting post reports')
    }
}

export const handleLikePost=async(
    postId:string,
    userId:string,
    postDbRepository:ReturnType<PostDbInterface>,
    // nofificationDbRepository:ReturnType<NotificationDbInterface>
)=>{
    try {
        await postDbRepository.likePost(postId,userId)
    } catch (error) {
        console.log('error in liking the post')
    }
}

export const handleUnlikePost=async(
    postId:string,
    userId:string,
    postDbRepository:ReturnType<PostDbInterface>
)=>{
    try {
        await postDbRepository.unlikePost(postId,userId)
    } catch (error) {
        console.log('error in liking the post')
    }
}

export const handleAddComment=async(
    userId:string,
    postId:string,
    comment:string,
    commentDbRepository:ReturnType<CommentDbInterface>
)=>{
    try {
        const commentObj={
            postId,
            commenterId: userId,
            comment
        }
       const commentResponse= await commentDbRepository.addComment(commentObj)
       return commentResponse
    } catch (error) {
        console.log('error in adding comment ',error)
    }
}

export const handleAddReply=async(
    userId:string,
    postId:string,
    parentId:string,
    comment:string,
    commentDbRepository:ReturnType<CommentDbInterface>
)=>{
    try {
        const replyObj={
            postId,
            commenterId: userId,
            comment,
            parentId
        }
       const commentResponse= await commentDbRepository.addReply(replyObj)
       return commentResponse
    } catch (error) {
        console.log('error in adding reply comment ',error)
    }
}

export const handleGetComments=async(
    postId:string,
    commentDbRepository:ReturnType<CommentDbInterface>
)=>{
    try {
        return await commentDbRepository.getComments(postId)
    } catch (error) {
        console.log('error in handling get comments ',error)
    }
}

