import sendMail from "../../utils/sendMail";

export const mailSenderService = () => {

    const sendVerificationMail = async (email: string, otp: number) => {
        const mailResponse = await sendMail(email, 'Sickomode - Email verification', `Otp for email verification is ${otp}`)
        return mailResponse
    }

    const sendPostBlockNotification=async(email:string,post:string)=>{
        const mailResponse=await sendMail(email,'Sickomode - Post blocked','Your post has been removed as it does not adhere to our community guidelines and standards.',post)
    }

    return {
        sendVerificationMail,
        sendPostBlockNotification
    }
}

export type MailSenderServie = typeof mailSenderService
export type MailSenderServieReturn = ReturnType<MailSenderServie>