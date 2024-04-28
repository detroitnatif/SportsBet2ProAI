'use client';

import React, { useState } from 'react'

function ChatPage() {
  const [fetching, setFetching ] = useState(true);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);

  return (
    <div className='w-screen h-screen flex flex-col bg-black text-white'>
      <div className='flex-grow overflow-y-hidden p-80 space-y-2'>
      {fetching && <div className='text-center font-bold'> Fetching... </div> }
      {messages.length === 0 && !fetching && <div className='text-center font-bold'> No Bets... </div>}
      </div>
    
      
    </div>
  )
}

export default ChatPage;
