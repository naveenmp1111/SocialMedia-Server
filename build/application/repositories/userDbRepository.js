"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDbRepository = void 0;
const userDbRepository = (repository) => {
    const addUser = async (user) => await repository.addUser(user);
    const getUserByEmail = async (email) => await repository.getUserByEmail(email);
    const getUserByUsername = async (username) => await repository.getUserByUsername(username);
    const addRefreshTokenAndExpiry = async (email, refreshToken) => await repository.addRefreshTokenAndExpiry(email, refreshToken);
    const editProfile = async (profileInfo) => await repository.editProfile(profileInfo);
    const checkUsernameForEdit = async (username, userId) => await repository.checkUsernameForEdit(username, userId);
    const checkEmailForEdit = async (email, userId) => await repository.checkEmailForEdit(email, userId);
    const getAllUsersForAdmin = async () => await repository.getAllUsersForAdmin();
    const blockUser = async (userId) => await repository.blockUser(userId);
    const unblockUser = async (userId) => await repository.unBlockUser(userId);
    const getUserById = async (userId) => await repository.getUserById(userId);
    const updatePost = async (userId, postId) => await repository.updatePosts(userId, postId);
    const resetPassword = async (email, password) => await repository.resetPassword(email, password);
    const getRestOfAllUsers = async (userId) => await repository.getRestOfAllUsers(userId);
    const followUser = async (userId, friendusername) => await repository.followUser(userId, friendusername);
    const unfollowUser = async (userId, friendusername) => await repository.unfollowUser(userId, friendusername);
    const getFollowers = async (username) => await repository.getFollowers(username);
    const getFollowing = async (username) => await repository.getFollowing(username);
    const getRequests = async (username) => await repository.getRequests(username);
    const acceptRequest = async (userId, friendUsername) => await repository.acceptRequest(userId, friendUsername);
    const removeFollower = async (userId, friendUsername) => await repository.removeFollower(userId, friendUsername);
    const savePost = async (userId, postId) => await repository.savePost(postId, userId);
    const unsavePost = async (userId, postId) => await repository.unsavePost(postId, userId);
    const getSavedPosts = async (userId) => await repository.getSavedPosts(userId);
    const cancelRequest = async (userId, friendUsername) => await repository.cancelRequest(userId, friendUsername);
    const declineRequest = async (userId, friendUsername) => await repository.declineRequest(userId, friendUsername);
    const blockUserByUsername = async (userId, username) => await repository.blockUserByUsername(userId, username);
    const unblockUserByUsername = async (userId, username) => await repository.unblockUserByUsername(userId, username);
    const getBlockedUsers = async (userId) => await repository.getBlockedUsers(userId);
    return {
        addUser,
        getUserByEmail,
        getUserByUsername,
        addRefreshTokenAndExpiry,
        editProfile,
        checkUsernameForEdit,
        checkEmailForEdit,
        getAllUsersForAdmin,
        blockUser,
        unblockUser,
        getUserById,
        updatePost,
        resetPassword,
        getRestOfAllUsers,
        followUser,
        unfollowUser,
        getFollowing,
        getFollowers,
        getRequests,
        acceptRequest,
        removeFollower,
        savePost,
        unsavePost,
        getSavedPosts,
        cancelRequest,
        declineRequest,
        blockUserByUsername,
        unblockUserByUsername,
        getBlockedUsers
    };
};
exports.userDbRepository = userDbRepository;
