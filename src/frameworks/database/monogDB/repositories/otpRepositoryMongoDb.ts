import Otp from "../models/otpModel"

export const otpRepositoryMongoDb=()=>{
    const saveNewOtp=async({email,otp}:{email:string,otp:number})=>{
        try {
            const otpObj=new Otp({email,otp});
            const savedOtp=await otpObj.save();
            return savedOtp
        } catch (error) {
            console.log(error)
        }
    }

    const getLatestOtp=async(email:string)=>{
        try {
            const otpObj=await Otp.findOne({email}).sort({createdAt:-1});
            return otpObj
        } catch (error) {
            console.log(error)
        }
    }

    return {
        saveNewOtp,
        getLatestOtp
    }
}

export type OtpRepositoryMongoDb=typeof otpRepositoryMongoDb