import { PostDataInterface } from "../../../../types/PostInterface"
import Post from "../models/postModel"
import Report from "../models/reportModel"
import User from "../models/userModel"
import { startOfWeek, endOfWeek, isWithinInterval, format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'

export const postRepositoryMongoDb = () => {
  const createPost = async (postData: PostDataInterface) => {
    try {
      const post = new Post(postData)
      const savedPost = await post.save()
      return savedPost
    } catch (error) {
      console.log(error)
    }
  }

  const getPostsByUser = async (username: string) => {
    try {
      const user = await User.findOne({ username })

      const UserPosts = await Post.aggregate([
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

      return UserPosts
    } catch (error) {
      console.log(error)
    }
  }
  const updatePostById = async (postId: string, description: string) => {
    try {
      const post = await Post.findByIdAndUpdate(postId, { $set: { description: description } }, { new: true });
      return post;
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const post = await Post.findByIdAndDelete(postId)
      return post
    } catch (error) {
      console.log(error)
    }
  }

  const reportPost = async (postId: string, reason: string, userId: string) => {
    try {
      const report = new Report({
        targetId: postId,
        type: 'post',
        reason: reason,
        reporterId: userId
      })
      await report.save()
    } catch (error) {
      console.log(error)
    }
  }

  const getAllPosts = async (userId: string) => {
    try {
      const user = await User.findById(userId);

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

      const posts = await Post.aggregate([
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
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch posts');
    }
  }

  const getAllPostsToExplore = async (userId: string) => {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const posts = await Post.aggregate([
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
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch posts');
    }
  }


  const getPostReports = async () => {
    const aggregatedReports = await Report.aggregate([
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
    return aggregatedReports
  }

  const blockPost = async (postId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $set: { isBlock: true } })
    } catch (error) {
      console.log('error in blocking post')
    }
  }

  const unBlockPost = async (postId: string) => {
    try {
      await Post.findByIdAndUpdate(postId, { $set: { isBlock: false } })
    } catch (error) {
      console.log('error in blocking post')
    }
  }

  const likePost = async (postId: string, userId: string) => {
    try {
      return await Post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true })
    } catch (error) {
      console.log('error in liking the post')
    }
  }

  const unlikePost = async (postId: string, userId: string) => {
    try {
      console.log('unlike post funtion called ')
      return await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } })
    } catch (error) {
      console.log('error in unliking the post')
    }
  }

  const getPostById = async (postId: string) => {
    try {
      const postData = await Post.findById(postId)
      return postData
    } catch (error) {
      console.log('error in getting post by id ', error)
    }
  }


  const getTaggedPosts = async (username: string) => {
    try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('User not found');
      }

      // Find posts where the user is tagged
      const posts = await Post.find({ taggedUsers: user._id })
        .populate('userId', 'profilePic username')
        .sort({ createdAt: -1 });

      // Transform the result to include `user` object
      const transformedPosts = posts.map(post => ({
        ...post.toObject(),
        user: {
          //@ts-ignore
          username: post.userId.username,
          //@ts-ignore
          profilePic: post.userId.profilePic
        },
        userId: undefined // Optionally remove userId if you don't want it in the final result
      }));

      return transformedPosts;
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching tagged posts');
    }
  };

  const getWeeklyData = async () => {
    try {
      const currentDate = new Date();
      //@ts-ignore
      const weekIntervals = [];

      // Calculate the start and end dates of each week in the current month
      for (let i = 0; i < 4; i++) {
        const start = startOfWeek(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1 + i * 7));
        const end = endOfWeek(start);
        weekIntervals.push({ start, end });
      }

      const weeklyUserCounts = Array(4).fill(0);
      const weeklyPostCounts = Array(4).fill(0);

      // Fetch all users created in the current month
      const users = await User.find({
        createdAt: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        }
      });

      // Fetch all posts created in the current month
      const posts = await Post.find({
        createdAt: {
          $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          $lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        }
      });

      // Aggregate user data
      users.forEach((user) => {
        //@ts-ignore
        weekIntervals.forEach((interval, index) => {
          if (isWithinInterval(user.createdAt, interval)) {
            weeklyUserCounts[index] += 1;
          }
        });
      });

      // Aggregate post data
      posts.forEach((post) => {
        //@ts-ignore
        weekIntervals.forEach((interval, index) => {
          //@ts-ignore
          if (isWithinInterval(post.createdAt, interval)) {
            weeklyPostCounts[index] += 1;
          }
        });
      });

      return {
        labels: weekIntervals.map((interval, index) => `Week ${index + 1} (${format(interval.start, 'MM/dd')} - ${format(interval.end, 'MM/dd')})`),
        users: weeklyUserCounts,
        posts: weeklyPostCounts,
      };
    } catch (error) {
      console.log('error in getting weekly data ', error)
    }
  }

  const getMonthlyData = async () => {
    try {
      const currentDate = new Date();
      const monthIntervals: any = [];

      // Calculate the start and end dates of the last 12 months
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(start);
        monthIntervals.push({ start, end });
      }

      const monthlyUserCounts = Array(12).fill(0);
      const monthlyPostCounts = Array(12).fill(0);

      // Fetch all users created in the last 12 months
      const users = await User.find({
        createdAt: {
          $gte: startOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1)),
          $lt: endOfMonth(currentDate)
        }
      });

      // Fetch all posts created in the last 12 months
      const posts = await Post.find({
        createdAt: {
          $gte: startOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1)),
          $lt: endOfMonth(currentDate)
        }
      });

      // Aggregate user data
      users.forEach((user) => {
        //@ts-ignore
        monthIntervals.forEach((interval, index) => {
          if (isWithinInterval(user.createdAt, interval)) {
            monthlyUserCounts[index] += 1;
          }
        });
      });

      // Aggregate post data
      posts.forEach((post) => {
        //@ts-ignore
        monthIntervals.forEach((interval, index) => {
          //@ts-ignore
          if (isWithinInterval(post.createdAt, interval)) {
            monthlyPostCounts[index] += 1;
          }
        });
      });

      return {
        //@ts-ignore
        labels: monthIntervals.map(interval => format(interval.start, 'MMMM yyyy')).reverse(),
        users: monthlyUserCounts.reverse(),
        posts: monthlyPostCounts.reverse(),
      };
    } catch (error) {
      console.log('error in getting monthly data', error)
    }
  }

  const getYearlyData = async () => {
    try {
      const currentDate = new Date();
      const yearIntervals: any = [];

      // Calculate the start and end dates of the last 5 years
      for (let i = 0; i < 5; i++) {
        const year = currentDate.getFullYear() - i;
        const start = startOfYear(new Date(year, 0, 1));
        const end = endOfYear(start);
        yearIntervals.push({ start, end });
      }

      const yearlyUserCounts = Array(5).fill(0);
      const yearlyPostCounts = Array(5).fill(0);

      // Fetch all users created in the last 5 years
      const users = await User.find({
        createdAt: {
          $gte: startOfYear(new Date(currentDate.getFullYear() - 4, 0, 1)),
          $lt: endOfYear(currentDate)
        }
      });

      // Fetch all posts created in the last 5 years
      const posts = await Post.find({
        createdAt: {
          $gte: startOfYear(new Date(currentDate.getFullYear() - 4, 0, 1)),
          $lt: endOfYear(currentDate)
        }
      });

      // Aggregate user data
      users.forEach((user) => {
        //@ts-ignore
        yearIntervals.forEach((interval, index) => {
          if (isWithinInterval(user.createdAt, interval)) {
            yearlyUserCounts[index] += 1;
          }
        });
      });

      // Aggregate post data
      posts.forEach((post) => {
        //@ts-ignore
        yearIntervals.forEach((interval, index) => {
          //@ts-ignore
          if (isWithinInterval(post.createdAt, interval)) {
            yearlyPostCounts[index] += 1;
          }
        });
      });

      return {
        //@ts-ignore
        labels: yearIntervals.map(interval => format(interval.start, 'yyyy')).reverse(),
        users: yearlyUserCounts.reverse(),
        posts: yearlyPostCounts.reverse(),
      };
    } catch (error) {
      console.log('error in getting yearly data ', error)
    }
  }

  const getAllPostsForAdmin = async () => {
    try {
      const posts = await Post.find().populate('userId', 'username profilePic')
      return posts
    } catch (error) {
      console.log('error in getting all posts for admin')
    }
  }


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
    getAllPostsToExplore,
    getPostById,
    getTaggedPosts,
    getWeeklyData,
    getMonthlyData,
    getYearlyData,
    getAllPostsForAdmin
  }
}

export type PostRepositoryMongoDb = typeof postRepositoryMongoDb