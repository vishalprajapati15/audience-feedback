import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/message.model";
import { User } from "next-auth";


export async function DELETE(request: Request, context: { params: any }) {

    // params can be a Promise in Next.js await it before accessing
    const params = await context.params;
    const messageId = params['message-id'];

    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not Authenticated!!'
        }, { status: 401 });
    }

    try {
        const deletedMessage = await MessageModel.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return Response.json({
                success: false,
                message: 'Message not found or already deleted!!'
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: 'Message deleted successfully!!'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in delete message route : ', error);
        return Response.json({
            success: false,
            message: ' Error in deleting message!!'
        }, { status: 500 });
    }


}