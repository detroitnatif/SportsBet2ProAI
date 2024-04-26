import { NextResponse } from "next/server"
import OpenAI from "openai";

export async function POST(req: Request) {
    const {message, threadID} = await req.json()

    if (!threadID || !message) {
        return NextResponse.json(
            {error: "threadID and message required"},
            {status: 400});
        
    }

    const openai = new OpenAI();

    try {
        const threadMessage = await openai.beta.threads.messages.create(threadId, {
            role: "user",
            content: message,
        });
    }
    
}