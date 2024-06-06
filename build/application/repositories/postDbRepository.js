"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postDbRepository = void 0;
const postDbRepository = (repository) => {
    const createPost = async (postData) => await repository.createPost(postData);
    const getMyPosts = async (userId) => await repository.getMyPosts(userId);
    const updatePostById = async (postId, description) => await repository.updatePostById(postId, description);
    const getAllPosts = async (userId) => await repository.getAllPosts(userId);
    return {
        createPost,
        getMyPosts,
        updatePostById,
        getAllPosts
    };
};
exports.postDbRepository = postDbRepository;
