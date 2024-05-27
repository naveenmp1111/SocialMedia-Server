import sendMail from "../../utils/sendMail";

export const mailSenderService=()=>{

    const sendVerificationMail=async(email:string,otp:number)=>{
        const mailResponse=await sendMail(email,'SOCIAL-MEDIA - Email verification',`Otp for email verification is ${otp}`)
        // console.log('mail response',mailResponse)
        return mailResponse
    }

    return{
        sendVerificationMail
    }
}

export type MailSenderServie=typeof mailSenderService
export type MailSenderServieReturn=ReturnType<MailSenderServie>