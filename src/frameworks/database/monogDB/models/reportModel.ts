import mongoose, { Document, ObjectId, Schema, model } from 'mongoose'

interface ReportInterface extends Document {
    targetId: ObjectId;
    type:string;
    reason?: string;
    reporterId:ObjectId;
    createdAt: Date;
}

const reportSchema = new Schema<ReportInterface>(
    {
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        type:{
            type:String
        },
        reason: {
            type: String,
        },
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
    }
);

const Report = model<ReportInterface>("Report", reportSchema);

export default Report;