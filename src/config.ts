import dotenv from 'dotenv'
dotenv.config()

const configKeys={
    MONGO_URL:process.env.MONGO_URL,
    PORT:process.env.PORT,
    MAIL_USERNAME:process.env.MAIL_USERNAME,
    MAIL_PASSKEY:process.env.MAIL_PASSKEY
}


export default configKeys