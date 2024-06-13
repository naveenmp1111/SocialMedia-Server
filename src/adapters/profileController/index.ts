import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { handleEditProfile, handleGetUserById } from "../../application/user-cases/profile/profileAuth";

//importing types
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/userRepositoryMongoDb";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterfaces";
import { ProfileInterface } from "../../types/ProfileInterface";
import { userRegister } from "../../application/user-cases/auth/userAuth";


const profileController = (
  userDbRepositoryImpl: UserRepositoryMongoDb,
  userDbRepositoryInterface: UserDbInterface,
  authServiceImpl: AuthService,
  authServiceInterface: AuthServiceInterface,
) => {
  const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
  const authService = authServiceInterface(authServiceImpl());

  const editProfile = asyncHandler(async (req: Request, res: Response) => {
    const profileInfo: ProfileInterface = req.body;
    // console.log('body data',req.body)
    const user = await handleEditProfile(profileInfo, dbUserRepository);
    // console.log('edited user profile ',user)
    res.json({
      status: "success",
      message: "user info fetched",
      user,
    });
  });

  const getUserById=asyncHandler(async(req:Request,res:Response)=>{
    const {userId}=req.params
    const userData=await handleGetUserById(userId,dbUserRepository)
    res.json({
      status:'success',
      message:'userdata fetched successfully',
      user:userData
    })
  })



  return {
    editProfile,
    getUserById
  }
}

export default profileController