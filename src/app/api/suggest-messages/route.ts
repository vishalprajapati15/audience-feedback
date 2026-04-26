import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';


export const runtime = 'edge';

export async function POST(req: Request) {
    try {

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. IMPORTANT: Return ONLY the questions separated by '||' with no additional text, no explanation, no prefix. For example: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'";

        const { text } = await generateText({
            model: groq('llama-3.1-8b-instant'), // you can change model
            prompt,
            maxOutputTokens: 300,
            temperature: 0.7
        });

        console.log('Suggested Message: ', text);

        // Clean up the text
        const cleanedText = text
            .split('\n')[0]
            .replace(/^["']|["']$/g, '')
            .trim();
        return NextResponse.json({ text: cleanedText });
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