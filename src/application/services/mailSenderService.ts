import { MailSenderServieReturn } from "../../frameworks/services/mailSenderService";

export const mailSenderServiceInterface = (service: MailSenderServieReturn) => {

    const sendVerificationMail = async (email: string, otp: number) => service.sendVerificationMail(email, otp)

    const sendPostBlockNotification=async(email:string,post:string)=>service.sendPostBlockNotification(email,post)


    return {
        sendVerificationMail,
        sendPostBlockNotification
    }
}
export type MailSenderServiceInterface = typeof mailSenderServiceInterface