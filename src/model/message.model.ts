import mongoose, { Schema, Document } from "mongoose";
import { Analysis } from "@/types/analysis.types"; 

export interface Message extends Document {
    content: string;
    userId: mongoose.Types.ObjectId;
    sentiment?: Analysis;
    emotion?: Analysis;
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
        label: String,
        score: Number
    },
    emotion:{
        label: String,
        score: Number
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>("Message", messageSchema);

export default MessageModel;