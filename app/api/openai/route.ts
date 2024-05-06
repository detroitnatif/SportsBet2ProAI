import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI();

export async function POST(request: Request){
    const {messages, secret} = await request.json()

    if(!messages || !secret){
        return NextResponse.json(
            {success: false, message: "Missing fields"},
            {
                status: 400,
            }
        );
    }

    if (secret !== process.env.APP_SECRET_KEY) {
        return NextResponse.json(
            {success: false, message: "Unauthorized to send openai message"},
            {status: 242}
        )
    }

    try {
        const completion = await openai.chat.completions.create({
            messages,
            model: "gpt-3.5-turbo-0125"
        })

        const newMessage = completion.choices[0].message.content;

        return NextResponse.json(
            {success: true, message: newMessage},
            {status: 200}
        );

    }catch(e){
        return NextResponse.json(
            {success: false, message: "No openai response"},
            {status: 499}
        )
    }
}