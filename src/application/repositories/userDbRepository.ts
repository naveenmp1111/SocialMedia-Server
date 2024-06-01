import { UserRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/userRepositoryMongoDb";

import { GoogleUserInterface, UserInterface } from "../../types/LoginUserInterface";
import { ProfileInterface } from "../../types/ProfileInterface";

export const userDbRepository = (repository:ReturnType<UserRepositoryMongoDb>)=>{
   
     const addUser  = async (user:UserInterface | GoogleUserInterface )=>await repository.addUser(user)

     const getUserByEmail = async (email:string)=>await repository.getUserByEmail(email)

     const getUserByUsername = async(username:string)=>await repository.getUserByUsername(username)

     const addRefreshTokenAndExpiry = async(email:string, refreshToken:string) => await repository.addRefreshTokenAndExpiry(email, refreshToken)

     const editProfile = async (profileInfo: ProfileInterface) =>await repository.editProfile(profileInfo);

     const checkUsernameForEdit=async(username:string,userId:string)=>await repository.checkUsernameForEdit(username,userId)

     const checkEmailForEdit=async(email:string,userId:string)=>await repository.checkEmailForEdit(email,userId)

     return{
        addUser,
        getUserByEmail,
        getUserByUsername,
        addRefreshTokenAndExpiry,
        editProfile,
        checkUsernameForEdit,
        checkEmailForEdit
     }
}

export type UserDbInterface = typeof userDbRepository;