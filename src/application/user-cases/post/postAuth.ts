import { PostDataInterface } from "../../../types/PostInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { PostDbInterface } from "../../repositories/postDbRepository"
import { UserDbInterface } from "../../repositories/userDbRepository"



export const handleCreatePost=async(
    postData:PostDataInterface,
    postDbRepository:ReturnType<PostDbInterface>,
    userDbRepository:ReturnType<UserDbInterface>
)=>{
    try {
        const createdPost=await postDbRepository.createPost(postData)
        if(createdPost){
            console.log('post created successfully')
            const updatedUserdata=await userDbRepository.updatePost(
                postData.userId as string,
                createdPost._id as string
              );
              console.log('updated user ',updatedUserdata)
        }
        return createdPost
    } catch (error) {
        console.log('Error creating in post',error)
        throw new AppError('Error creating in post',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

export const handleGetMyPosts=async(
    userId:string,
    postDbRepository:ReturnType<PostDbInterface>,
)=>{
    try {
        const myPosts=await postDbRepository.getMyPosts(userId)
        return myPosts
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
    try {
        const allPosts=await postDbRepository.getAllPosts(userId)
        return allPosts
    } catch (error) {
        console.log('errror in getting all posts',error)
    }
}