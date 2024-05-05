import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request){
    const user = await currentUser();

    if (!user) {
        return NextResponse.json(
            {success: false, message: "unauthorized"},
            {status: 401}
        );
    }
    const {id, challengeId, notification, } = await request.json();

    if (!challengeId || !id) {
        return NextResponse.json({message: "No prefs found", success: false}, {status: 444})
    }
    try {
    
        const newChallengePreference = await prismadb.challengePreferences.update({
            where: {
                id: id,
                userId: user.id
            },
            data: {
                challengeId: challengeId,
                sendNotifications: notification,
            },
        });
        return NextResponse.json(
            {data: newChallengePreference, success:true},
            {status:200}
        )

    }
    catch (e) {
        return NextResponse.json({
            success: false, message: "no pref created"
        }, {status: 500})
    }

}