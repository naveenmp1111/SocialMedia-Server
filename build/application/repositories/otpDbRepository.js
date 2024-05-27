"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpDbRepository = void 0;
const otpDbRepository = (repository) => {
    const saveNewOtp = async ({ email, otp }) => await repository.saveNewOtp({ email, otp });
    const getLatestOtp = async (email) => await repository.getLatestOtp(email);
    return {
        saveNewOtp,
        getLatestOtp
    };
};
exports.otpDbRepository = otpDbRepository;
