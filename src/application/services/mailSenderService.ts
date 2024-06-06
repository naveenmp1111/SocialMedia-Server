import { MailSenderServieReturn } from "../../frameworks/services/mailSenderService";

export const mailSenderServiceInterface = (service: MailSenderServieReturn) => {

    const sendVerificationMail = async (email: string, otp: number) => service.sendVerificationMail(email, otp)


    return {
        sendVerificationMail
    }
}
export type MailSenderServiceInterface = typeof mailSenderServiceInterface