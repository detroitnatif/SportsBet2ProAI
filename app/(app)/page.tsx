'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ThreadMessage } from 'open';
import axios from 'axios';
import { useAtom } from 'jotai';
import { userThreadAtom } from '@/atoms';

const POLLING_FREQ_MS = 1000;

function ChatPage() {
  const [fetching, setFetching] = useState(true);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [atomUserThread] = useAtom(userThreadAtom);

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
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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

  return (
    <div className='w-screen h-screen flex flex-col bg-black text-white'>
      <div className='flex-grow overflow-y-hidden p-80 space-y-2'>
      {fetching && messages.length === 0 && <div className='text-center font-bold'> Fetching... </div> }
      {messages.length === 0 && !fetching && <div className='text-center font-bold'> No Bets... </div>}
     
      {messages.map((message) => (
        <div key={message.id}> {message.content[0].type === 'text' ? message.content[0].text.value: null}</div>
      ))}
      </div>
    
      
    </div>
  );
}

export default ChatPage;
