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
        resetPassword
    };
};
exports.userDbRepository = userDbRepository;
