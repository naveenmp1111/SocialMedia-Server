"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDbRepository = void 0;
const postDbRepository = (repository) => {
    const createPost = async (postData) => await repository.createPost(postData);
    const getPostsByUser = async (username) => await repository.getPostsByUser(username);
    const updatePostById = async (postId, description) => await repository.updatePostById(postId, description);
    const getAllPosts = async (userId) => await repository.getAllPosts(userId);
    const getAllPostsToExplore = async (userId) => await repository.getAllPostsToExplore(userId);
    const deletePost = async (postId) => await repository.deletePost(postId);
    const reportPost = async (postId, reason, userId) => await repository.reportPost(postId, reason, userId);
    const getPostReports = async () => await repository.getPostReports();
    const blockPost = async (postId) => await repository.blockPost(postId);
    const unblockPost = async (postId) => await repository.unBlockPost(postId);
    const likePost = async (postId, userId) => await repository.likePost(postId, userId);
    const unlikePost = async (postId, userId) => await repository.unlikePost(postId, userId);
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
        getAllPostsToExplore
    };
};
exports.postDbRepository = postDbRepository;
