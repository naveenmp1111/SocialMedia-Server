"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepositoryMongoDb = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const postRepositoryMongoDb = () => {
    const createPost = async (postData) => {
        try {
            const post = new postModel_1.default(postData);
            const savedPost = await post.save();
            return savedPost;
        }
        catch (error) {
            console.log(error);
        }
    };
    const getPostsByUser = async (username) => {
        try {
            // const myPosts=await Post.find({userId}).sort({createdAt:-1})
            const user = await userModel_1.default.findOne({ username });
            const UserPosts = await postModel_1.default.aggregate([
                {
                    $addFields: {
                        userIdObject: { $toObjectId: user?._id }
                    }
                },
                {
                    $match: { $expr: { $eq: ["$userId", "$userIdObject"] }, isBlock: false }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        hashtags: 1,
                        hashtagsArray: 1,
                        description: 1,
                        likes: 1,
                        comments: 1,
                        saved: 1,
                        reports: 1,
                        image: 1,
                        isBlock: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                            _id: "$user._id",
                            name: "$user.name",
                            username: "$user.username",
                            email: "$user.email",
                            profilePic: "$user.profilePic"
                        }
                    }
                }
            ]).sort({ createdAt: -1 });
            console.log('myposts', UserPosts);
            return UserPosts;
        }
        catch (error) {
            console.log(error);
        }
    };
    const updatePostById = async (postId, description) => {
        try {
            //   const post = await Post.findById(postId)
            const post = await postModel_1.default.findByIdAndUpdate(postId, { $set: { description: description } }, { new: true });
            //   console.log('updated post ',post)
            return post;
        }
        catch (err) {
            console.log(err);
        }
    };
    const deletePost = async (postId) => {
        try {
            const post = await postModel_1.default.findByIdAndDelete(postId);
            return post;
        }
        catch (error) {
            console.log(error);
        }
    };
    const reportPost = async (postId, reason, userId) => {
        try {
            const report = new reportModel_1.default({
                targetId: postId,
                type: 'post',
                reason: reason,
                reporterId: userId
            });
            await report.save();
        }
        catch (error) {
            console.log(error);
        }
    };
    const getAllPosts = async (userId) => {
        try {
            const user = await userModel_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const hasFollowing = user.following && user.following.length > 0;
            const matchCondition = hasFollowing
                ? {
                    $or: [
                        { "postUser._id": { $in: user.following, $nin: user.blocklist } },
                        { "postUser.isPrivate": false, "postUser._id": { $nin: user.blocklist } }
                    ]
                }
                : { "postUser.isPrivate": false, "postUser._id": { $nin: user.blocklist } };
            const posts = await postModel_1.default.aggregate([
                {
                    $match: { isBlock: false }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        // preserveNullAndEmptyArrays: true // Optional: Include posts without a user
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "postUser"
                    }
                },
                {
                    $unwind: "$postUser"
                },
                {
                    $match: matchCondition
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        hashtags: 1,
                        hashtagsArray: 1,
                        description: 1,
                        likes: 1,
                        comments: 1,
                        saved: 1,
                        reports: 1,
                        image: 1,
                        isBlock: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                            _id: "$user._id",
                            name: "$user.name",
                            username: "$user.username",
                            email: "$user.email",
                            profilePic: "$user.profilePic",
                        },
                    }
                }
            ]);
            return posts;
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to fetch posts');
        }
    };
    const getAllPostsToExplore = async (userId) => {
        try {
            const user = await userModel_1.default.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // const hasFollowing = user.following && user.following.length > 0;
            // const matchCondition = hasFollowing
            //   ? { "postUser._id": { $in: user.following, $nin: user.blocklist } }
            //   : { "postUser.isPrivate": false, "postUser._id": { $nin: user.blocklist } };
            const posts = await postModel_1.default.aggregate([
                {
                    $match: { isBlock: false }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: {
                        path: "$user",
                        // preserveNullAndEmptyArrays: true // Optional: Include posts without a user
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "postUser"
                    }
                },
                {
                    $unwind: "$postUser"
                },
                {
                    $match: { "postUser.isPrivate": false, "postUser._id": { $nin: user.blocklist } }
                },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        hashtags: 1,
                        hashtagsArray: 1,
                        description: 1,
                        likes: 1,
                        comments: 1,
                        saved: 1,
                        reports: 1,
                        image: 1,
                        isBlock: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        user: {
                            _id: "$user._id",
                            name: "$user.name",
                            username: "$user.username",
                            email: "$user.email",
                            profilePic: "$user.profilePic",
                        },
                    }
                }
            ]);
            // Shuffle the posts using the Fisher-Yates algorithm
            for (let i = posts.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [posts[i], posts[j]] = [posts[j], posts[i]];
            }
            return posts;
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to fetch posts');
        }
    };
    const getPostReports = async () => {
        const aggregatedReports = await reportModel_1.default.aggregate([
            {
                $match: { type: "post" } // Filter for reports related to posts
            },
            {
                $group: {
                    _id: "$targetId",
                    count: { $sum: 1 },
                    reporters: {
                        $push: { reporterId: "$reporterId", reason: "$reason" }
                    }
                }
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "post"
                }
            },
            {
                $unwind: "$post"
            },
            {
                $lookup: {
                    from: "users",
                    localField: "reporters.reporterId",
                    foreignField: "_id",
                    as: "reporterDetails"
                }
            },
            {
                $addFields: {
                    reporters: {
                        $map: {
                            input: "$reporters",
                            as: "report",
                            in: {
                                name: {
                                    $arrayElemAt: [
                                        "$reporterDetails.username",
                                        { $indexOfArray: ["$reporterDetails._id", "$$report.reporterId"] }
                                    ]
                                },
                                reason: "$$report.reason"
                            }
                        }
                    }
                }
            },
            {
                $sort: { count: -1 } // Sort by count in descending order
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    reporters: 1,
                    post: 1
                }
            }
        ]);
        console.log('aggregated reports are ', aggregatedReports);
        return aggregatedReports;
    };
    const blockPost = async (postId) => {
        try {
            await postModel_1.default.findByIdAndUpdate(postId, { $set: { isBlock: true } });
        }
        catch (error) {
            console.log('error in blocking post');
        }
    };
    const unBlockPost = async (postId) => {
        try {
            await postModel_1.default.findByIdAndUpdate(postId, { $set: { isBlock: false } });
        }
        catch (error) {
            console.log('error in blocking post');
        }
    };
    const likePost = async (postId, userId) => {
        try {
            return await postModel_1.default.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
        }
        catch (error) {
            console.log('error in liking the post');
        }
    };
    const unlikePost = async (postId, userId) => {
        try {
            const unlikeData = await postModel_1.default.findByIdAndUpdate(postId, { $pull: { likes: userId } });
        }
        catch (error) {
            console.log('error in unliking the post');
        }
    };
    return {
        createPost,
        getPostsByUser,
        updatePostById,
        getAllPosts,
        deletePost,
        reportPost,
        getPostReports,
        blockPost,
        unBlockPost,
        likePost,
        unlikePost,
        getAllPostsToExplore
    };
};
exports.postRepositoryMongoDb = postRepositoryMongoDb;
