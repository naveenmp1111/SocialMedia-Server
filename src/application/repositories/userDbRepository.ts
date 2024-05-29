import { UserRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/userRepositoryMongoDb";

import { GoogleUserInterface, UserInterface } from "../../types/userInterface";

export const userDbRepository = (repository:ReturnType<UserRepositoryMongoDb>)=>{
   
     const addUser  = async (user:UserInterface | GoogleUserInterface )=>await repository.addUser(user)

     const getUserByEmail = async (email:string)=>await repository.getUserByEmail(email)

     const getUserByUsername = async(username:string)=>await repository.getUserByUsername(username)

     return{
        addUser,
        getUserByEmail,
        getUserByUsername
     }
}

export type UserDbInterface = typeof userDbRepository;