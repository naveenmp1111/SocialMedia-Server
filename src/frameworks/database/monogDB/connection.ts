import mongoose from 'mongoose';
import configKeys from '../../../config';


mongoose.set('strictQuery', true)

const connectDB = async () => {
    try {
        await mongoose.connect(configKeys.MONGO_URL)
        console.log('Database connected Successfully')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB