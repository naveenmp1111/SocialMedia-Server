"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetAllPostsForAdmin = exports.handleGetYearlyData = exports.handleGetMonthlyData = exports.handleGetWeeklyData = exports.handleUnblockPost = exports.handleBlockPost = exports.handleUnblockUser = exports.handleBlockUser = exports.handleGetAllUsersForAdmin = void 0;
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
const handleBlockPost = async (postId, dbPostRepository, dbUserRepository, mailSenderService) => {
    const postData = await dbPostRepository.blockPost(postId);
    console.log('postData while blockiing is ');
    //@ts-ignore
    const userData = await dbUserRepository.getUserById(postData.userId);
    console.log('userData while blocking post is ', userData);
    //@ts-ignore
    await mailSenderService.sendPostBlockNotification(userData.email, postData.image[0]);
    return postData;
};
exports.handleBlockPost = handleBlockPost;
const handleUnblockPost = async (postId, dbPostRepository) => {
    const userData = dbPostRepository.unblockPost(postId);
    return userData;
};
exports.handleUnblockPost = handleUnblockPost;
const handleGetWeeklyData = async (postDbRepository) => {
    try {
        return await postDbRepository.getWeeklyData();
    }
    catch (error) {
        console.log('error in getting weekly data ', error);
    }
};
exports.handleGetWeeklyData = handleGetWeeklyData;
const handleGetMonthlyData = async (postDbRepository) => {
    try {
        return await postDbRepository.getMonthlyData();
    }
    catch (error) {
        console.log('error in getting monthly data');
    }
};
exports.handleGetMonthlyData = handleGetMonthlyData;
const handleGetYearlyData = async (postDbRepository) => {
    try {
        return await postDbRepository.getYearlyData();
    }
    catch (error) {
        console.log('error in getting yearly data', error);
    }
};
exports.handleGetYearlyData = handleGetYearlyData;
const handleGetAllPostsForAdmin = async (postDbRepository) => {
    try {
        return await postDbRepository.getAllPostsForAdmin();
    }
    catch (error) {
        console.log('error in gettig all posts for admin ', error);
    }
};
exports.handleGetAllPostsForAdmin = handleGetAllPostsForAdmin;
