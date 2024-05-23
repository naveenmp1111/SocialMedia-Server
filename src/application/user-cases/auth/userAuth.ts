import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterfaces";
import AppError from "../../../utils/appError"; 
import { HttpStatus } from "../../../types/httpStatus";

//importing from types

import { UserInterface } from "../../../types/userInterface";



export const userRegister=async(
    user:UserInterface,
    dbUserRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
    const isExistingEmail=await dbUserRepository.getUserByEmail(user.email)
    if(isExistingEmail){
        throw new AppError('Email already taken',HttpStatus.UNAUTHORIZED)
    }

    const isExistingUsername=await dbUserRepository.getUserByEmail(user.username)
    if(isExistingUsername){
        throw new AppError('Username already taken',HttpStatus.UNAUTHORIZED)
    }

    user.password=await authService.encryptPassword(user.password)

    await dbUserRepository.addUser(user)
}

export const userLogin=async(
    email:string,
    password:string,
    dbUserRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
    console.log('coming to use cases')
    const user=await dbUserRepository.getUserByEmail(email)
    if(!user){
        throw new AppError('Invalid email',HttpStatus.UNAUTHORIZED)
    }
    if(user.isBlock){
        throw new AppError('Your account has been blocked',HttpStatus.UNAUTHORIZED)
    }
    const isPasswordCorrect=await authService.comparePassword(
        password,
        user?.password || ''
    )
    if(!isPasswordCorrect){
        throw new AppError('Incorrect Password',HttpStatus.UNAUTHORIZED)
    }

    const userDetails={
        _id: user?._id.toString(),
    name: user?.name,
    username: user?.username,
    email: user?.email,
    dp: user?.dp,
    bio: user?.bio,
    gender: user?.gender,
    isBlock: user.isBlock
  };
    
  return userDetails
}