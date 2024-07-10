import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface
interface INotification extends Document {
  receiverId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  event: 'like' | 'comment' | 'message' | 'follow';
  isSeen: boolean;
}

// Define the schema
const NotificationSchema: Schema = new Schema({
  receiverId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  senderId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  event: { type: String, required: true, enum: ['like', 'comment', 'message', 'follow'] },
  isSeen: { type: Boolean, required: true, default: false }
},{
    timestamps:true
});

// Create the model
const Notification: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
