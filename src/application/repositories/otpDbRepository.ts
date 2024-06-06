import { OtpRepositoryMongoDb } from "../../frameworks/database/monogDB/repositories/otpRepositoryMongoDb";


export const otpDbRepository = (repository: ReturnType<OtpRepositoryMongoDb>) => {

    const saveNewOtp = async ({ email, otp }: { email: string, otp: number }) => await repository.saveNewOtp({ email, otp });

    const getLatestOtp = async (email: string) => await repository.getLatestOtp(email)

    return {
        saveNewOtp,
        getLatestOtp
    }
}

export type OtpDbInterface = typeof otpDbRepository