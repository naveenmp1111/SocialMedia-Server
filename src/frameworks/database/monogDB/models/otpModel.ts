import { Document, Schema, model } from 'mongoose'

interface OtpInterface extends Document {
    email: string;
    otp: number;
    createdAt: Date;
}

const otpSchema = new Schema<OtpInterface>({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5
    }
})

const Otp = model<OtpInterface>('Otp', otpSchema)

export default Otp;