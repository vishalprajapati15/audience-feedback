import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    userId: mongoose.Types.ObjectId;
    sentiment?: string;
    emotion?: string;
    createdAt: Date;
}

const messageSchema = new Schema<Message>({
    content:{
        type: String,
        required: true
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref: "User"
    },
    sentiment:{
        type: String
    },
    emotion:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", messageSchema);

export default MessageModel;