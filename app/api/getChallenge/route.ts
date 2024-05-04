import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(){
    const user = await currentUser();

    if (!user) {
        return NextResponse.json(
            {success: false, message: "unauthorized"},
            {status: 401}
        );
    }
    const challengePreferences = await prismadb.challengePreferences.findUnique({
        where:{userId: user.id},
    });

    if (challengePreferences) {
        return NextResponse.json({challengePreferences, success: true}, {status: 200})
    }
    try {
    
        const newChallengePreference = await prismadb.challengePreferences.create({
            data: {
                userId: user.id,
                challengeId: "EASY"
            },
        });
        return NextResponse.json(
            {userThread: newChallengePreference, success:true},
            {status:200}
        )

    }
    catch (e) {
        return NextResponse.json({
            success: false, message: "no pref created"
        }, {status: 500})
    }



}