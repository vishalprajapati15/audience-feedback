import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
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
        const messages = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!messages || messages.length === 0) {
            console.log('User not found with id:', userId);
            return Response.json({
                success: false,
                message: 'Messages not found!!'
            }, { status: 401 });
        }

        return Response.json({
            success: true,
            messages: messages[0].messages,
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