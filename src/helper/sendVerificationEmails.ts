import { resend } from "@/lib/resend";
import VerificationEmail from "../../emailTemplets/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: 'onborading@resend.dev',
            to: email,
            subject: 'Audience Feedback Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
        })

        return {
            success: true,
            message: 'Verification email send Successfully!!'
        }
    } catch (error) {
        console.error("Error Sending Verification email: ", error);
        return {
            success: false,
            message: 'Failed to send verification email!!'
        }
    }
}