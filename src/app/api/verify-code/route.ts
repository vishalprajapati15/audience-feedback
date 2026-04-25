import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";



export async function POST(request: Request) {
    await dbConnect()
    try {
        const { username, code } = await request.json();

        if (!username || !code) {
            return Response.json({
                success: false,
                message: 'Username and code are required'
            }, { status: 400 });
        }

        const decodedUserName = decodeURIComponent(username);

        const trimmedCode = code.trim();

        console.log('Verification attempt - Username:', decodedUserName, 'Code:', trimmedCode, 'Code Type:', typeof code);

        const user = await UserModel.findOne({ username: decodedUserName })

        if (!user) {
            return Response.json({
                success: false,
                message: 'Username not found'
            }, { status: 400 });
        }

        if (user.isVerified) {
            return Response.json({
                success: false,
                message: 'User is already verified!!'
            }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === trimmedCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        console.log('Code comparison - Stored:', user.verifyCode, 'Received:', trimmedCode, 'Match:', isCodeValid, 'Expired:', !isCodeNotExpired);

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: 'User verified successfully!!'
            }, { status: 200 });
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'Verification code is expired. Please sign-up again!!'
            }, { status: 400 });
        }
        else {
            return Response.json({
                success: false,
                message: 'Incorrect verification Code!!'
            }, { status: 400 });
        }



    } catch (error) {
        console.error("error verifying username : ", error);
        return Response.json({
            success: false,
            message: 'Error verifying username!!'
        }, { status: 500 });
    }
}