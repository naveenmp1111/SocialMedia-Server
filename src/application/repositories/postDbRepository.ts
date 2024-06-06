import { PostRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/postRepositoryMongoDb";
import { PostDataInterface } from "../../types/PostInterface";


export const postDbRepository = (repository: ReturnType<PostRepositoryMongoDb>) => {

    const createPost = async (postData: PostDataInterface) => await repository.createPost(postData)

    const getMyPosts =async(userId:string)=>await repository.getMyPosts(userId)

    const updatePostById=async(postId:string,description:string)=>await repository.updatePostById(postId,description)

    const getAllPosts=async(userId:string)=>await repository.getAllPosts(userId)

    return {
        createPost,
        getMyPosts,
        updatePostById,
        getAllPosts
    }

}

export type PostDbInterface=typeof postDbRepository