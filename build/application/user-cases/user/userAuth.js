"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollowUser = exports.handleGetRestOfAllUsers = void 0;
const handleGetRestOfAllUsers = async (userId, dbUserRepository) => {
    const users = await dbUserRepository.getRestOfAllUsers(userId);
    return users;
};
exports.handleGetRestOfAllUsers = handleGetRestOfAllUsers;
const handleFollowUser = async (userId, friendId, dbUserRepository) => {
    const response = await dbUserRepository.followUser(userId, friendId);
};
exports.handleFollowUser = handleFollowUser;
