import { PostRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/postRepositoryMongoDb";
import { PostDataInterface } from "../../types/PostInterface";


export const postDbRepository = (repository: ReturnType<PostRepositoryMongoDb>) => {

    const createPost = async (postData: PostDataInterface) => await repository.createPost(postData)

    const getPostsByUser =async(userId:string)=>await repository.getPostsByUser(userId)

    const updatePostById=async(postId:string,description:string)=>await repository.updatePostById(postId,description)

    const getAllPosts=async(userId:string)=>await repository.getAllPosts(userId)

    const deletePost=async(postId:string)=>await repository.deletePost(postId)

    return {
        createPost,
        getPostsByUser,
        updatePostById,
        getAllPosts,
        deletePost
    }

}

export type PostDbInterface=typeof postDbRepository