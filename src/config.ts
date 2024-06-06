import dotenv from 'dotenv'
dotenv.config()

const configKeys = {
    MONGO_URL: process.env.MONGO_URL as string,
    PORT: process.env.PORT,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSKEY: process.env.MAIL_PASSKEY,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string
}


export default configKeys