import { PostDataInterface } from "../../../../types/PostInterface"
import Post from "../models/postModel"
import Report from "../models/reportModel"
import User from "../models/userModel"
// const { ObjectId } = require('mongoose').Types;
import { ObjectId } from "mongoose"

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
      // const myPosts=await Post.find({userId}).sort({createdAt:-1})

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
      ]);


      console.log('myposts', UserPosts)
      return UserPosts
    } catch (error) {
      console.log(error)
    }
  }
  const updatePostById = async (postId: string, description: string) => {
    try {
      //   const post = await Post.findById(postId)
      const post = await Post.findByIdAndUpdate(postId, { $set: { description: description } }, { new: true });
      //   console.log('updated post ',post)
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
      const user = await User.findById(userId)

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
          $match: {
            "postUser._id": { $in: user?.following, $nin: user?.blocklist  }
          }
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
      ])
      return posts;
    } catch (error) {
      console.log(error)
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
    console.log('aggregated reports are ', aggregatedReports)
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

  const likePost=async(postId:string,userId:string)=>{
    try {
       await Post.findByIdAndUpdate(postId,{$addToSet:{likes:userId}})
    } catch (error) {
      console.log('error in liking the post')
    }
  }

  const unlikePost=async(postId:string,userId:string)=>{
    try {
      const unlikeData= await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}})
    } catch (error) {
      console.log('error in unliking the post')
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
  }
}

export type PostRepositoryMongoDb = typeof postRepositoryMongoDb