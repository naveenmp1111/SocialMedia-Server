import { Request,Response } from "express";
import asyncHandler from "express-async-handler";


//importing types
import { CloudinaryService } from "../../frameworks/services/cloudinaryService";
import { CloudinaryServiceInterface } from "../../application/services/cloudinaryServiceInterface";
import { UserDbInterface } from "../../application/repositories/userDbRepository";
import { UserRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/userRepositoryMongoDb";
import { AuthService } from "../../frameworks/services/authService";
import { AuthServiceInterface } from "../../application/services/authServiceInterfaces";
import { ProfileInterface } from "../../types/ProfileInterface";

import { handleEditProfile } from "../../application/user-cases/profile/profileAuth";

const profileController=(
    // cloudinaryServiceImpl: CloudinaryService,
    // cloudinaryServiceInterface: CloudinaryServiceInterface,
    userDbRepositoryImpl: UserRepositoryMongoDb,
    userDbRepositoryInterface: UserDbInterface,
    authServiceImpl: AuthService,
    authServiceInterface: AuthServiceInterface,
)=>{
    const dbUserRepository = userDbRepositoryInterface(userDbRepositoryImpl());
//   const cloudinaryService = cloudinaryServiceInterface(cloudinaryServiceImpl());
  const authService = authServiceInterface(authServiceImpl());

  const editProfile = asyncHandler(async (req: Request, res: Response) => {
    const profileInfo: ProfileInterface = req.body;
    console.log('body data',req.body)
    const user = await handleEditProfile(profileInfo, dbUserRepository);
    console.log('updatdUserData',user)
    res.json({
      status: "success",
      message: "user info fetched",
      user,
    });
  });

  return {
    editProfile
  }
}

export default profileController