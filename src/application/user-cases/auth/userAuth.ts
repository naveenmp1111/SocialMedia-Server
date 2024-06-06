import { UserDbInterface } from "../../repositories/userDbRepository";
import { AuthServiceInterface } from "../../services/authServiceInterfaces";
import AppError from "../../../utils/appError";
import { HttpStatus } from "../../../types/httpStatus";
import otpGenerator from 'otp-generator'

//importing from types

import { UserInterface } from "../../../types/LoginUserInterface";
import { MailSenderServiceInterface } from "../../services/mailSenderService";
import { OtpDbInterface } from "../../repositories/otpDbRepository";



export const userRegister = async (
  user: UserInterface,
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const isExistingEmail = await dbUserRepository.getUserByEmail(user.email)
  if (isExistingEmail) {
    throw new AppError('Email already taken', HttpStatus.UNAUTHORIZED)
  }


  const isExistingUsername = await dbUserRepository.getUserByEmail(user.username)
  if (isExistingUsername) {
    throw new AppError('Username already taken', HttpStatus.UNAUTHORIZED)
  }

  user.password = await authService.encryptPassword(user.password)

  await dbUserRepository.addUser(user)
}


export const userLogin = async (
  email: string,
  password: string,
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const user = await dbUserRepository.getUserByEmail(email)
  if (!user) {
    throw new AppError('Invalid email', HttpStatus.UNAUTHORIZED)
  }
  if (user.isBlock) {
    throw new AppError('Your account has been blocked', HttpStatus.UNAUTHORIZED)
  }
  const isPasswordCorrect = await authService.comparePassword(
    password,
    user?.password || ''
  )
  if (!isPasswordCorrect) {
    throw new AppError('Incorrect Password', HttpStatus.UNAUTHORIZED)
  }

  const userDetails = {
    _id: user?._id.toString(),
    name: user?.name,
    username: user?.username,
    email: user?.email,
    bio: user?.bio,
    profilePic: user?.profilePic,
    isBlock: user.isBlock,
    role:user.role
  };
  const refreshToken = await authService.generateRefreshToken(user._id.toString(), user.role)
  const accessToken = await authService.generateAccessToken(user._id.toString(), user.role)
  await dbUserRepository.addRefreshTokenAndExpiry(user.email, refreshToken);

  return { userDetails, refreshToken, accessToken }
}


export const handleSendOtp = async (
  email: string,
  dbOtpRepository: ReturnType<OtpDbInterface>,
  mailSenderService: ReturnType<MailSenderServiceInterface>,
) => {
  const otpString = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const otp = parseInt(otpString)
  console.log('Otp is ', otp)
  await dbOtpRepository.saveNewOtp({ email, otp })
  const response = await mailSenderService.sendVerificationMail(email, otp)
  return response
}

export const handleOtpVerification = async (
  email: string,
  otp: number,
  dbOtpRepository: ReturnType<OtpDbInterface>,
) => {
  const otpObj = await dbOtpRepository.getLatestOtp(email)
  if (!otpObj) {
    throw new AppError("Invalid otp!", HttpStatus.UNAUTHORIZED);
  }

  const currentTime: number = new Date().getTime()
  const otpCreationTime: number = new Date(otpObj.createdAt).getTime()

  if ((currentTime - otpCreationTime) > 60000) {
    throw new AppError('Otp time out', HttpStatus.UNAUTHORIZED)
  }

  if (otpObj.otp != otp) {
    throw new AppError("Invalid otp!", HttpStatus.UNAUTHORIZED);
  }
  if (otpObj.otp == otp) return true

}

export const userLoginUsingGoogle = async (
  user: { name: string; email: string },
  dbUserRepository: ReturnType<UserDbInterface>,
  authService: ReturnType<AuthServiceInterface>
) => {
  const isExistingEmail = await dbUserRepository.getUserByEmail(user.email)
  if (isExistingEmail) {
    if (isExistingEmail.isBlock) {
      throw new AppError('User is Blocked', HttpStatus.UNAUTHORIZED)
    }

    const refreshToken = await authService.generateRefreshToken(isExistingEmail._id.toString(), isExistingEmail.role)
    const accessToken = await authService.generateAccessToken(isExistingEmail._id.toString(), isExistingEmail.role)
    const userDetails = {
      name: isExistingEmail.name,
      email: isExistingEmail.email,
      username: isExistingEmail.username,
      isBlock: isExistingEmail.isBlock,
      bio: isExistingEmail?.bio,
      profilePic: isExistingEmail?.profilePic,
      role:isExistingEmail.role
    }

    await dbUserRepository.addRefreshTokenAndExpiry(userDetails.email, refreshToken);
    return { userDetails, accessToken, refreshToken }
  }

  const otpString = otpGenerator.generate(4, {
    lowerCaseAlphabets: true,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const username = user.email.slice(0, user.email.indexOf('@')) + otpString

  const newUser = {
    name: user.name,
    email: user.email,
    isGoogleSignin: true,
    username: username
  }
  const userDetails = await dbUserRepository.addUser(newUser)
  const accessToken = await authService.generateAccessToken(userDetails._id.toString(), userDetails.role)
  const refreshToken = await authService.generateRefreshToken(userDetails._id.toString(), userDetails.role)
  await dbUserRepository.addRefreshTokenAndExpiry(newUser.email, refreshToken);
  return { userDetails, accessToken, refreshToken }
}

export const handleRefreshAccessToken=async(
  cookies:{refreshToken:string},
  dbUserRepository:ReturnType<UserDbInterface>,
  authService:ReturnType<AuthServiceInterface>
)=>{
  console.log('cookies ',cookies)
  if (!cookies?.refreshToken) {
    throw new AppError("Invalid token!", HttpStatus.UNAUTHORIZED);
  }
  const refreshToken = cookies.refreshToken;
  const { userId, role } = authService.verifyRefreshToken(refreshToken.toString());
  if (!userId || role !== "client") {
    throw new AppError("Invalid token!2", HttpStatus.UNAUTHORIZED);
  }
  const user = await dbUserRepository.getUserById(userId);
  if (!user?.refreshToken && !user?.refreshTokenExpiresAt) {
    throw new AppError("Invalid token!3", HttpStatus.UNAUTHORIZED);
  }
  if (user) {
    const expiresAt = user.refreshTokenExpiresAt.getTime();
    if (Date.now() > expiresAt) {
      throw new AppError("Invalid token!4", HttpStatus.UNAUTHORIZED);
    }
  }
  const newAccessToken = authService.generateAccessToken(userId,"client");
  return newAccessToken;

}