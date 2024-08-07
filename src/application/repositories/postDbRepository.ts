import { PostRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/postRepositoryMongoDb";
import { PostDataInterface } from "../../types/PostInterface";


export const postDbRepository = (repository: ReturnType<PostRepositoryMongoDb>) => {

    const createPost = async (postData: PostDataInterface) => await repository.createPost(postData)

    const getPostsByUser = async (username: string) => await repository.getPostsByUser(username)

    const updatePostById = async (postId: string, description: string) => await repository.updatePostById(postId, description)

    const getAllPosts = async (userId: string) => await repository.getAllPosts(userId)

    const getAllPostsToExplore = async (userId: string) => await repository.getAllPostsToExplore(userId)

    const deletePost = async (postId: string) => await repository.deletePost(postId)

    const reportPost = async (postId: string, reason: string, userId: string) => await repository.reportPost(postId, reason, userId)

    const getPostReports = async () => await repository.getPostReports()

    const blockPost = async (postId: string) => await repository.blockPost(postId)

    const unblockPost = async (postId: string) => await repository.unBlockPost(postId)

    const likePost = async (postId: string, userId: string) => await repository.likePost(postId, userId)

    const unlikePost = async (postId: string, userId: string) => await repository.unlikePost(postId, userId)

    const getPostById = async (postId: string) => await repository.getPostById(postId)

    const getTaggedPosts = async (username: string) => await repository.getTaggedPosts(username)

    const getWeeklyData = async () => await repository.getWeeklyData()

    const getMonthlyData = async () => await repository.getMonthlyData()

    const getYearlyData = async () => await repository.getYearlyData()

    const getAllPostsForAdmin = async () => await repository.getAllPostsForAdmin()

    return {
        createPost,
        getPostsByUser,
        updatePostById,
        getAllPosts,
        deletePost,
        reportPost,
        getPostReports,
        blockPost,
        unblockPost,
        likePost,
        unlikePost,
        getAllPostsToExplore,
        getPostById,
        getTaggedPosts,
        getWeeklyData,
        getMonthlyData,
        getYearlyData,
        getAllPostsForAdmin
    }

}

export type PostDbInterface = typeof postDbRepository