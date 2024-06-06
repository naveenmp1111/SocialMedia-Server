import User from '../models/userModel'
import { GoogleUserInterface, UserInterface } from '../../../../types/LoginUserInterface'
import mongoose from 'mongoose'
import { ProfileInterface } from '../../../../types/ProfileInterface'

export const userRepositoryMongoDb = () => {
  const addUser = async (user: UserInterface | GoogleUserInterface) => {
    try {
      const newUser = new User(user)
      return await newUser.save()
    } catch (error) {
      console.log(error)
      throw new Error('Error adding user to database')
    }
  }

  const getUserByEmail = async (email: string) => {
    try {
      // console.log(email)
      const user = await User.findOne({ email });
      // console.log('user',user)
      return user;
    } catch (error) {
      console.log(error)
      throw new Error('Error finding user by email')
    }
  }

  const getUserByUsername = async (username: string) => {
    try {
      // console.log(username)
      const user = await User.findOne({ username })
      // console.log('user',user)
      return user
    } catch (error) {
      console.log(error)
      throw new Error('Error finding user by username')
    }
  }

  const checkUsernameForEdit = async (username: string, userId: string) => {
    try {
      const user = await User.findOne({ username, _id: { $ne: userId } });
      return user
    } catch (error) {
      console.log(error)
      throw new Error('Error in checkUsenameForEdit')
    }
  }

  const checkEmailForEdit = async (email: string, userId: string) => {
    try {
      const user = await User.findOne({ email, _id: { $ne: userId } })
      return user
    } catch (error) {
      console.log('error in checkemail for edit', error)
      throw new Error('error in checkemailfor edit')
    }
  }

  const addRefreshTokenAndExpiry = async (
    email: string,
    refreshToken: string
  ) => {
    try {
      const refreshTokenExpiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );
      const user = await User.findOneAndUpdate(
        { email },
        { refreshToken, refreshTokenExpiresAt },
        { new: true }
      );
      // console.log('user is ', user)
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Error adding refresh token and expiry!");
    }
  };

  const editProfile = async (profileInfo: ProfileInterface) => {
    try {
      let user
      // console.log('profile link is ',profileInfo.profilePic)
      if (profileInfo.profilePic) {
        user = await User.findByIdAndUpdate(profileInfo.userId, profileInfo, {
          new: true,
        });
      } else {
        user = await User.findByIdAndUpdate(profileInfo.userId, {
          name: profileInfo.name,
          username: profileInfo.username,
          phoneNumber: profileInfo.phoneNumber,
          bio: profileInfo.bio,
          email: profileInfo.email,
        },
          {
            new: true,
          });
      }
      // console.log('updated user is ',user)
      return user;
    } catch (error) {
      console.log(error);
      throw new Error("Error updating profile!");
    }
  };

  const getAllUsersForAdmin = async () => {
    try {
      const users = await User.find({ role: 'client' },
        {
          _id: 1,
          username: 1,
          profilePic: 1,
          name: 1,
          email: 1,
          bio: 1,
          isBlock: 1,
          isGoogleSignedIn: 1
        })
      return users
    } catch (error) {
      console.log(error);
      throw new Error('Error in finding the users for admin')
    }
  }

  const blockUser = async (userId: string) => {
    try {
      const userData = await User.findByIdAndUpdate(userId, { $set: { isBlock: true } }, { new: true })
      return userData
    } catch (error) {
      console.log(error)
      throw new Error('Erron in blocking the user')
    }
  }

  const unBlockUser = async (userId: string) => {
    try {
      return await User.findByIdAndUpdate(userId, { $set: { isBlock: false } })
    } catch (error) {
      console.log(error)
      throw new Error('Erron in unblocking the user')
    }
  }

  const getUserById=async(userId:string)=>{
    try {
      return await User.findById(userId)
    } catch (error) {
      console.log(error)
      throw new Error('error in get User by Id')
    }
  }

  const updatePosts = async (userId: string, postId: string) => {
    try {
     const data= await User.updateOne({ _id: userId }, { $push: { posts: postId } });
     console.log(data)
    } catch (error) {
      console.log(error);
      throw new Error ("Error updating posts!")
    }
  };


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
    unBlockUser,
    getUserById,
    updatePosts
  }
}
export type UserRepositoryMongoDb = typeof userRepositoryMongoDb;