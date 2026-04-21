import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';


export const runtime = 'edge';

export async function POST(req: Request) {
    try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be saperated by '||'. These questions are for an anonyms social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topic, focusing instead on universal themes that encourage friendly interaction. For example your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || what's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

        const { messages } = await req.json();

        const result = await streamText({
            model: groq('llama-3.1-8b-instant'), // you can change model
            messages,
            maxOutputTokens: 300,
            temperature: 0.7
        });

        return result.toTextStreamResponse();
    } catch (error) {
        console.error("An unexpected error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}