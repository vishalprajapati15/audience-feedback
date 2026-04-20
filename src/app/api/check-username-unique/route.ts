import dbConnect from "@/lib/dbConnect";
import { z } from 'zod'
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
});


export async function GET(req: Request) {

    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate 
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log("Username after zod validation", result);               //

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid Query parameters(Username)'
            }, { status: 400 });
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken!!'
            }, { status: 400 });
        }

        return Response.json({
                success: true,
                message: 'Username is available!!'
            }, { status: 200 });

    } catch (error) {
        console.error("error Checking username : ", error);
        return Response.json({
            success: false,
            message: 'Error checknig username!!'
        }, { status: 500 });
    }
}