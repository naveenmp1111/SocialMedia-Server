import User from '../models/userModel'
import { GoogleUserInterface, UserInterface } from '../../../../types/userInterface'
import mongoose from 'mongoose'

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

    return {
        addUser,
        getUserByEmail,
        getUserByUsername
    }
}
export type UserRepositoryMongoDb = typeof userRepositoryMongoDb;