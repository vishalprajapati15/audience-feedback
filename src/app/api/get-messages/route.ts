import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/message.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated!!'
        }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        console.log('Fetching messages for userId:', userId);
        const messages = await MessageModel.find({ userId }).sort({ createdAt: -1 });

        if (!messages || messages.length === 0) {
            console.log('No messages found for userId:', userId);
            return Response.json({
                success: true,
                messages: [],
                message: 'No messages found!!'
            }, { status: 200 });
        }

        console.log('Message Received : ', messages)

        return Response.json({
            success: true,
            messages: messages,
            message: 'Message fetched successfully!!'
        }, { status: 200 });
    } catch (error) {
        console.error('Messages fetching error : ', error)
        return Response.json({
            success: false,
            message: 'Message fetching Error!!'
        }, { status: 500 });
    }
}