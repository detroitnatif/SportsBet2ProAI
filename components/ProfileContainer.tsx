'use client';
import { ChallengePreferences } from '@prisma/client';
import React from 'react'
import {Button} from './ui/button'
import { Switch } from './ui/switch';
interface ProfileContainerProps {
    challengePreferences: ChallengePreferences;
}
import { useState } from 'react';

const levels = [
    {id: 'NOVICE',
    name: 'Novice',
    description: "Recieve a bet once a day based on your favorite teams"},

    {id: 'INTERMEDIATE',
    name: 'INTERMEDIATE',
    description: "Recieve a bet twice a day based on your favorite teams and players"},

    {id: 'PRO',
    name: 'Pro',
    description: "Recieve a bet three times a day based on your favorite teams and players"}
]

const handleLevel = 

export default function ProfileContainer({challengePreferences} : ProfileContainerProps) {
    const [sendNotifications, setSendNotifications] = useState(challengePreferences.sendNotifications)


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
      <div>
        {levels.map((level) => (
        <LevelCard key={level.id} name={level.name} description={level.description} onClick={() => handleLevel(level.id)} />
        ))};
      </div>
    </div>
  )

};

