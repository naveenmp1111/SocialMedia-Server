import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterfaces";
import AppError from "../../../utils/appError"; 
import { HttpStatus } from "../../../types/httpStatus";
import otpGenerator from 'otp-generator'

//importing from types

import { UserInterface } from "../../../types/userInterface";
import { MailSenderServiceInterface } from "../../services/mailSenderService";
import { OtpDbInterface } from "../../repositories/otpDbRepository";



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
    bio: user?.bio,
    profilePic: user?.profilePic,
    isBlock: user.isBlock
  };
    
  return userDetails
}

export const handleSendOtp=async(
    email:string,
    dbOtpRepository:ReturnType<OtpDbInterface>,
    mailSenderService:ReturnType<MailSenderServiceInterface>,
)=>{
        const otpString =otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });
        const otp=parseInt(otpString)
          console.log('Otp is ',otp)
        //   console.log('type is ',typeof otp)
          await dbOtpRepository.saveNewOtp({email,otp})
          const response= await mailSenderService.sendVerificationMail(email,otp)
        //   console.log('response in userAuth in user case',response)
          return response
}

export const handleOtpVerification=async(
    email:string,
    otp:number,
    dbOtpRepository:ReturnType<OtpDbInterface>,
)=>{
        const otpObj=await dbOtpRepository.getLatestOtp(email)
        if (!otpObj) {
            throw new AppError("Invalid otp!", HttpStatus.UNAUTHORIZED);
          }

          const currentTime:number = new Date().getTime()
          const otpCreationTime:number = new Date(otpObj.createdAt).getTime()
        
          if ((currentTime - otpCreationTime) > 60000) {
            throw new AppError('Otp time out',HttpStatus.UNAUTHORIZED)
          }

        if(otpObj.otp!=otp){
            throw new AppError("Invalid otp!", HttpStatus.UNAUTHORIZED);
        }
          if(otpObj.otp==otp)return true

}

export const userLoginUsingGoogle=async(
    user:{name:string;email:string},
    dbUserRepository:ReturnType<UserDbInterface>,
    authService:ReturnType<AuthServiceInterface>
)=>{
   const isExistingEmail=await dbUserRepository.getUserByEmail(user.email)
   if(isExistingEmail){
      if(isExistingEmail.isBlock){
        throw new AppError('User is Blocked',HttpStatus.UNAUTHORIZED)
      }
      const userDetails={
        name:isExistingEmail.name,
        email:isExistingEmail.email,
        username:isExistingEmail.username,
        isBlock:isExistingEmail.isBlock
      }
      return userDetails
   }
   const newUser={
    name:user.name,
    email:user.email,
    isGoogleSignin:true
   }
   const userDetails=await dbUserRepository.addUser(newUser)
   return userDetails
}