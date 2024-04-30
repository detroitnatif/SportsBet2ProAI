'use client';

import NavBar from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useAtom } from "jotai";
import { userThreadAtom } from "@/atoms";
import { UserThread } from "@prisma/client";

export default function AppLayout({children}: {children: React.ReactNode}){
    // const [userThread, setUserThread] = useState<UserThread | null>(null);
    const [userThread, setUserThread] = useAtom(userThreadAtom)

    useEffect(() => {

        async function getUserThread() {
           try{

           
            const response = await axios.get<{success: boolean; message?: string; userThread: UserThread; }>('/api/user-thread');
        
            if (!response.data.success || !response.data.userThread) {
                console.error("Error fetching user thread")
                return;
            }
            setUserThread(response.data.userThread);
        }
            catch(error){
                setUserThread(null);
            }
            }
        getUserThread();
    }, []);
    return (
        <div className="flex flex-col w-full h-full">
            <NavBar/>
            {children}
        </div>
    )
}
