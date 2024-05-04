'use client';
import { ChallengePreferences } from '@prisma/client';
import React from 'react'
import {Button} from './ui/button'
import { Switch } from './ui/switch';
interface ProfileContainerProps {
    challengePreferences: ChallengePreferences;
}
import { useState } from 'react';
import LevelCard from './LevelCard';
import axios from 'axios';

const levels = [
    {id: 'NOVICE',
    name: 'Novice',
    description: "Recieve a bet once a day based on your favorite teams"},

    {id: 'INTERMEDIATE',
    name: 'Intermediate',
    description: "Recieve a bet twice a day based on your favorite teams and players"},

    {id: 'PRO',
    name: 'Pro',
    description: "Recieve a bet three times a day based on your favorite teams and players"}
]



export default function ProfileContainer({challengePreferences} : ProfileContainerProps) {
    const [sendNotifications, setSendNotifications] = useState(challengePreferences.sendNotifications)

    
    const handleLevel = async() => {
        try{await axios.post<{
        success: boolean;
        error?: string;
        data?: string;
    
    }>('/api/challengeUpdate',{id, notification, challengeId})}
    
    catch(e){
        return;
    }
};

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-2xl'>Challenge Level</h1>
        <Button>Save</Button>
      </div>
      <div className='flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg'>
        <div>
            <h3 className='font-medium text-lg text-gray-900'>Push Notification</h3>
            <p>Receive push notifications when new challenges are available</p>
        </div>
        <Switch checked={sendNotifications}></Switch>
      </div>
      <div className='flex flex-col p-5 mb-10'>
        {levels.map((level) => (
        <LevelCard key={level.id} name={level.name} description={level.description} onClick={() => handleLevel(level.id)} />
        ))};
      </div>
    </div>
  )

};

