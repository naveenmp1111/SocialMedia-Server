import { Request, Response, response } from 'express';

import { UserRepositoryMongoDb } from '../../frameworks/database/monogDB/repositories/userRepositoryMongoDb';
import { UserDbInterface } from '../../application/repositories/userDbRepository';

import asyncHandler from 'express-async-handler';
import { handleFollowUser, handleGetRestOfAllUsers } from '../../application/user-cases/user/userAuth';



const userController = (
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface
  ) => {
    
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  
    const getRestOfAllUsers = asyncHandler(async (req: Request, res: Response) => {
        const {userId}=req.body
      const users = await handleGetRestOfAllUsers(userId,dbUserRepository);
      res.json({
        users
      });
    });

    const followUser = asyncHandler(async(req:Request, res:Response)=>{
      const {userId,friendId}=req.body
      console.log('2 ids are ',userId,friendId)
      await handleFollowUser(userId,friendId,dbUserRepository)
      res.json({
        status:'success',
        message:'Following successfull'
      })
    })

    return{ 
        getRestOfAllUsers,
        followUser

    }
  }

  export default userController