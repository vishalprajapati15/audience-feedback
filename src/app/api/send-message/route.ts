import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import MessageModel from "@/model/message.model";


export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found!!'
            }, { status: 404 })
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: 'User is not accepting message!!'
            }, { status: 403 })
        }

        const newMessage = new MessageModel({
            content,
            userId: user._id,
            createdAt: new Date()
        });

        await newMessage.save();

        return Response.json({
            success: true,
            message: 'Message send successfully!!'
        }, { status: 200 })

    } catch (error) {
        console.error('Error sending messages : ', error);

        return Response.json({
            success: false,
            message: 'Error sending messages!!'
        }, { status: 500 })
    }
}