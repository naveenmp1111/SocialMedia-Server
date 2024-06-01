import User from '../models/userModel'
import { GoogleUserInterface, UserInterface } from '../../../../types/LoginUserInterface'
import mongoose from 'mongoose'
import { ProfileInterface } from '../../../../types/ProfileInterface'

export const userRepositoryMongoDb=()=>{
    const addUser= async(user:UserInterface | GoogleUserInterface)=>{
        try {
            const newUser=new User(user)
            return await newUser.save()
        } catch(error) {
            console.log(error)
            throw new Error('Error adding user to database')
        }
    }

    const getUserByEmail=async(email:string)=>{
        try {
            // console.log(email)
            const user=await User.findOne({email});
            // console.log('user',user)
            return user;
        } catch (error) {
            console.log(error)
            throw new Error('Error finding user by email')
        }
    }

    const getUserByUsername=async(username:string)=>{
        try {
            // console.log(username)
            const user=await User.findOne({username})
            // console.log('user',user)
            return user
        } catch (error) {
            console.log(error)
            throw new Error('Error finding user by username')
        }
    }

    const checkUsernameForEdit=async(username:string,userId:string)=>{
      try {
        const user = await User.findOne({ username, _id: { $ne: userId } });
        return user
      } catch (error) {
        console.log(error)
        throw new Error('Error in checkUsenameForEdit')
      }
    }

    const checkEmailForEdit=async(email:string,userId:string)=>{
      try {
        const user=await User.findOne({email,_id:{$ne:userId}})
        return user
      } catch (error) {
        console.log('error in checkemail for edit',error)
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
          console.log('user is ',user)
          return user;
        } catch (error) {
          console.log(error);
          throw new Error("Error adding refresh token and expiry!");
        }
      };

      const editProfile = async (profileInfo: ProfileInterface) => {
        try {
          let user
          if(profileInfo.profilePic){
             user = await User.findByIdAndUpdate(profileInfo.userId, profileInfo, {
              new: true,
            });
          }else{
             user = await User.findByIdAndUpdate(profileInfo.userId, {
                name:profileInfo.name,
                username:profileInfo.username,
                phoneNumber:profileInfo.phoneNumber,
                bio:profileInfo.bio,
                email:profileInfo.email,
             }, 
             {
              new: true,
            });
          }
          
          return user; 
        } catch (error) {
          console.log(error);
          throw new Error("Error updating profile!");
        }
      };


    return {
        addUser,
        getUserByEmail,
        getUserByUsername,
        addRefreshTokenAndExpiry,
        editProfile,
        checkUsernameForEdit,
        checkEmailForEdit
    }
}
export type UserRepositoryMongoDb = typeof userRepositoryMongoDb;