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
import toast from 'react-hot-toast';

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

type Difficulties = "EASY" | "INTERMEDIATE" | "PRO"


export default function ProfileContainer({challengePreferences} : ProfileContainerProps) {
    const [saving, setSaving] = useState(false)
    const [sendNotifications, setSendNotifications] = useState(challengePreferences.sendNotifications)
    const [difficuly, setDifficulty] = useState(challengePreferences.challengeId)

    const changeNotifications = () => {
        setSendNotifications((prev) => (!prev));
    };

    const changeLevel = (levelId: Difficulties) => {
        setDifficulty(levelId)
    }
    

    
    const handleSave = async() => {
        setSaving(true)
        try{
        const response = await axios.post<{
        success: boolean;
        data?: ChallengePreferences;
        message?: string;
    
    }>('/api/challengeUpdate',
    {id: challengePreferences.id,
    challengeId: difficuly, 
    sendNotifications, 
})
    console.log(response)
    if (!response.data.data || !response.data.success){
        toast.error(response.data.message ?? "something went wrong")
        return;
    }}

    
    catch(e){
        console.error(e);
        toast.error("Something went wrong. Please try again.");
        return;
    }finally{
        setSaving(false);
    }
};


  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between items-center mb-4'>
        <h1 className='font-bold text-2xl'>Challenge Level</h1>
        <Button onClick={handleSave}>{saving ? "Saving" : "Save"}</Button>
      </div>
      <div className='flex flex-row items-center justify-between mb-4 p-4 shadow rounded-lg'>
        <div>
            <h3 className='font-medium text-lg text-gray-900'>Push Notification</h3>
            <p>Receive push notifications when new challenges are available</p>
        </div>
        <Switch checked={sendNotifications} onCheckedChange={changeNotifications}></Switch>
      </div>
      <div className='flex flex-col p-5 mb-10'>
        {levels.map((level) => (
        <LevelCard key={level.id} name={level.name} description={level.description} selected={level.id === difficuly} onSelect={() => changeLevel(level.id as Difficulties)} />
        ))}
      </div>
    </div>
  )

};

