"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUnblockPost = exports.handleBlockPost = exports.handleUnblockUser = exports.handleBlockUser = exports.handleGetAllUsersForAdmin = void 0;
const handleGetAllUsersForAdmin = async (dbUserRepository) => {
    const users = dbUserRepository.getAllUsersForAdmin();
    return users;
};
exports.handleGetAllUsersForAdmin = handleGetAllUsersForAdmin;
const handleBlockUser = async (userId, dbUserRepository) => {
    const userData = dbUserRepository.blockUser(userId);
    return userData;
};
exports.handleBlockUser = handleBlockUser;
const handleUnblockUser = async (userId, dbUserRepository) => {
    const userData = dbUserRepository.unblockUser(userId);
    return userData;
};
exports.handleUnblockUser = handleUnblockUser;
const handleBlockPost = async (postId, dbPostRepository) => {
    const userData = dbPostRepository.blockPost(postId);
    return userData;
};
exports.handleBlockPost = handleBlockPost;
const handleUnblockPost = async (postId, dbPostRepository) => {
    const userData = dbPostRepository.unblockPost(postId);
    return userData;
};
exports.handleUnblockPost = handleUnblockPost;
