'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ThreadMessage } from '@openai/client';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userThreadAtom } from '@/atoms';
import { UserThread } from '@prisma/client';

const POLLING_FREQ_MS = 1000;

function ChatPage() {
  const [fetching, setFetching] = useState(true);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [message, setMessage] = useState("");
  const [atomUserThread] = useAtom(userThreadAtom);
  const [sending, setSending] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!atomUserThread) return;
    setFetching(true);
    try {
      const response = await axios.get<{
        success: boolean;
        error?: string;
        messages?: ThreadMessage[];
      }>("/api/messages/list", {
        params: {
          threadId: atomUserThread.threadId
        }
      });

      if (!response.data.success || !response.data.messages) {
        console.error(response.data.error ?? 'error occurred fetching messages');
        setFetching(false);
        return;
      }
      
      let newMessages = response.data.messages;
      newMessages = newMessages.sort((a, b) => {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }).filter(message => {
        return message.content[0].type === 'text' && message.content[0].text.value.trim() !== '';
      });
      setMessages(newMessages);
    } catch (e) {
      console.log("no messages retrieved");
      setMessages([]);
    } finally {
      setFetching(false);
    }
  }, [atomUserThread]);

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, POLLING_FREQ_MS);
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchMessages]);


  const sendMessage = async (userThread: UserThread, success: boolean, message: string) => {
    if (!userThread || sending) return;

    try {
        const response = await axios.post<{ success: boolean; message?: ThreadMessage; error?: string }>("/api/message/create", {
            message,
            threadId: userThread.threadId,
            fromUser: "true",
        });

        if (response.data.success) {
            console.log('Message sent:', response.data.message);
            const newMessages = response.data.message;
        } else {
            console.error('Error sending message:', response.data.error);
        }
    } catch (error) {
        console.error('Failed to send message:', error);
    }
    
    setMessages((prev) => [...prev, newMessages]);
};




  return (
    <div className='w-screen h-[calc(100vh-64px)] flex flex-col bg-black text-white'>
      <div className='flex-grow overflow-y-hidden p-80 space-y-2'>
      {fetching && messages.length === 0 && <div className='text-center font-bold'> Fetching... </div> }
      {messages.length === 0 && !fetching && <div className='text-center font-bold'> No Bets... </div>}
     
      {messages.map((message) => (
        <div key={message.id} className={`px-4 py-2 mb-3 rounded-lg w-fit text-lg ${
          ['true', "True"].includes(
            (message.metadata as {fromUser?: string}).fromUser ?? ""
      )
      ? "bg-yellow"
      : "bg-grey"}`}
    >
           {message.content[0].type === 'text' ? message.content[0].text.value: null}</div>
      ))}
      </div>

     <div className='mt-auto p-4 bg-gray-800'>
      <div className='flex items-center bg-white p-2'>
        <input 
          type='text'
          className='flex-grow bg transparent text-black focus: outline-none'
          placeholder='Type a message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
        <button disabled={!userThread?. threadId || sending || !message.trim()}
        className='ml-4 bg-yellow-500 text-black px-3 py-2 rounded-ful focus:outline-none'
        onClick={sendMessage}
        
        >
        Send
        </button>

      </div>
      </div> 
    
      
    </div>
  );
}

export default ChatPage;





// const sendMessage = async () => {
//   if (!userThread || sending) return;

//   const {
//     data: {message: newMessage}
//   } = await axios.post<{
//     success: boolean;
//     message?: ThreadMessage;
//     error?: string;
//   }>{"/api/message/create", {
//     message,
//     threadId: userThread.threadId,
//     fromUser: "true",
//   }};

// };
