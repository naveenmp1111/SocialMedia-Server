"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDbRepository = void 0;
const postDbRepository = (repository) => {
    const createPost = async (postData) => await repository.createPost(postData);
    const getPostsByUser = async (userId) => await repository.getPostsByUser(userId);
    const updatePostById = async (postId, description) => await repository.updatePostById(postId, description);
    const getAllPosts = async (userId) => await repository.getAllPosts(userId);
    const deletePost = async (postId) => await repository.deletePost(postId);
    return {
        createPost,
        getPostsByUser,
        updatePostById,
        getAllPosts,
        deletePost
    };
};
exports.postDbRepository = postDbRepository;
