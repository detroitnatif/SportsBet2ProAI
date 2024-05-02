'use client';

import NavBar from "@/components/ui/navbar";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useAtom } from "jotai";
import { userThreadAtom, assistantAtom } from "@/atoms";
import { Assistant, UserThread } from "@prisma/client";
import toast from 'react-hot-toast';

export default function AppLayout({children}: {children: React.ReactNode}){
    // const [userThread, setUserThread] = useState<UserThread | null>(null);
    const [userThread, setUserThread] = useAtom(userThreadAtom)
    const [assistant, setAssistant] = useAtom(assistantAtom)

    useEffect(() => {
        if(assistant) return;
        async function getAssistant(){
            try{
                const response = await axios.get<{
                    success: boolean;
                    error?: string;
                    assistant: Assistant;
                }>('api/assistant');

                if (!response.data.success || !response.data.assistant){
                    toast.error('failed to fetch assistant')
                    setAssistant(null)
                    return 

                }
                setAssistant(response.data.assistant);

            }catch(e){
                setAssistant(null)
                return
            }
        }
        getAssistant();
    }, [setAssistant])

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
