import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(){
    const openai = new OpenAI()

    try{
        const assistant = await openai.beta.assistants.create({
            model: "gpt-3.5-turbo",
            name: "SportsBetAI",
            instructions: `
            are supposed to use knowledge of sports 
            to give predictions on sports games, 
            if you dont know, make it up

            `
        })

        console.log(assistant)
        return NextResponse.json({ assistant}, {status: 200});
    }
    catch (error) {
        return NextResponse.json({ error }, {status: 500});
    }
}