import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import MessageModel from "@/model/message.model";
import { User } from "next-auth";
import mongoose from "mongoose";
import { analyzeFeedbackBatch } from "@/ml/service/analysis.service";

type CountStats = Record<string, { count: number; percentage: number }>;

export async function POST() {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated!!"
            },
            { status: 401 }
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const messages = await MessageModel.find({ userId });

        if (!messages || messages.length === 0) {
            return Response.json(
                {
                    success: true,
                    message: "No messages found!!",
                    totalMessages: 0
                },
                { status: 200 }
            );
        }

        const texts = messages.map((m) => m.content);

        const results = await analyzeFeedbackBatch(texts);

        console.log('Result after : analysis: ', results);

        const sentimentCount: Record<string, number> = {};
        const emotionCount: Record<string, number> = {};

        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const result = results[i];

            await MessageModel.findByIdAndUpdate(msg._id, {
                sentiment: result.sentiment,
                emotion: result.emotion
            });

            const sLabel = result.sentiment.label;
            sentimentCount[sLabel] = (sentimentCount[sLabel] || 0) + 1;

            const eLabel = result.emotion.label;
            emotionCount[eLabel] = (emotionCount[eLabel] || 0) + 1;
        }

        const toPercentage = (data: Record<string, number>, total: number): CountStats => {
            const formatted: CountStats = {};
            for (const key in data) {
                formatted[key] = {
                    count: data[key],
                    percentage: parseFloat(((data[key] / total) * 100).toFixed(2))
                };
            }
            return formatted;
        };

        const getDominant = (data: CountStats): { label: string | null; count: number } => {
            let maxKey: string | null = null;
            let maxValue = 0;

            for (const key in data) {
                if (data[key].count > maxValue) {
                    maxValue = data[key].count;
                    maxKey = key;
                }
            }

            return { label: maxKey, count: maxValue };
        };


        const sentimentStats = toPercentage(sentimentCount, messages.length);
        const emotionStats = toPercentage(emotionCount, messages.length);
        console.log('sentimentStats : ', sentimentStats);
        console.log('emotionStats : ', emotionStats);

        const dominantSentiment = getDominant(sentimentStats);
        const dominantEmotion = getDominant(emotionStats);
        console.log('dominantSentiment : ', dominantSentiment);
        console.log('dominantEmotion : ', dominantEmotion);

        return Response.json(
            {
                success: true,
                totalMessages: messages.length,
                statistics: {
                    sentiment: sentimentStats,
                    emotion: emotionStats
                },
                dominantSentiment,
                dominantEmotion,
                message: "Feedback analyzed successfully!!"
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Analysis Error:", error);

        return Response.json(
            {
                success: false,
                message: `Analysis failed: ${message}`
            },
            { status: 500 }
        );
    }
}