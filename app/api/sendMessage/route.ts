import { prismadb } from "@/lib/prismadb";
import { UserThread, UserMeta } from "@prisma/client";
import axios from "axios";
import { cp } from "fs";
import { NextResponse } from "next/server";
import OpenAI from "openai";



interface UserThreadMap {
    [userId: string]: UserThread;
}

interface UserMetaMap {
    [userId: string]: UserMeta;
  }

export async function POST(request: Request){
    const body = await request.json();

    const { challengeId, secret} = body;

    if (!challengeId || !secret){
        return 
        console.log("not authorized")
    }
    if (secret !== process.env.APP_SECRET_KEY){
        return 
        console.log("Wrong secret key")
    }


    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: `
            Generate a hypotheical sports bet using historical data of players 

            for example: Lebron james will score more than 30 points
            `
        },
        {
            role: "user",
            content: "Give me a sports bet you think will be positive using historical data"
    
        }
    ]

    const {
        data: {message, success},
    } = await axios.post<{message?: string; success: boolean}>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/openai`,
        {messages,
        secret: process.env.APP_SECRET_KEY
    }
    );



    if (!message || !success) {
        return NextResponse.json({message: "something went wrong with openai response", success: false}, {status: 222})
    }
    console.log(message)
    
    const challengePreferences = await prismadb.challengePreferences.findMany({
            where: {
                challengeId,
            },
        });
    const userIds = challengePreferences.map((cp) => cp.userId);

    const userThreads = await prismadb.userThread.findMany({
        where: {
            userId: {
                in: userIds,
            },
        },
    });

    const userMetas = await prismadb.userMeta.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
      });

    const UserThreadMap: UserThreadMap = userThreads.reduce((map, thread) => {
        map[thread.userId] = thread;
        return map;

    }, {} as UserThreadMap);

    const userMetaMap = userMetas.reduce((map, meta) => {
        map[meta.userId] = meta;
        return map;
      }, {} as UserMetaMap);
    

    const threadAndNotificationsPromises: Promise<any>[] = [];

    try{
        challengePreferences.forEach((cp) => {
            const userThread = UserThreadMap[cp.userId];

            if (userThread){
                threadAndNotificationsPromises.push(
                    axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/message/create`,{
                        message,
                        threadId: userThread.threadId,
                        fromUser: 'false',
                    })
                );
                // if (cp.sendNotifications) {
                //     const correspondingUserMeta = userMetaMap[cp.userId];
                //     threadAndNotificationsPromises.push(
                //         axios.post(
                //             `${process.env.NEXT_PUBLIC_BASE_URL}/api/send-notifications`,
                //             {
                //                 subscription: {
                //                     endpoint: correspondingUserMeta.endpoint,
                //                     keys: {
                //                         auth: correspondingUserMeta.auth,
                //                         p256dh: correspondingUserMeta.p256dh,
                //                     },
                //                 },
                //                 message,
                //             }
                //         )
                //     )
                // }
            }
        });
        await Promise.all(threadAndNotificationsPromises);
        return NextResponse.json({message}, {status:200});
    }catch(e){
        console.error(e)
        return NextResponse.json({success: false, message: "something went wrong with sending notif"},
        {
            status: 501,
        } )
    }

    }


