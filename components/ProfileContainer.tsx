import { ChallengePreferences } from '@prisma/client';
import React from 'react'
import {Button} from './ui/button'
interface ProfileContainerProps {
    challengePreferences: ChallengePreferences;
}

function ProfileContainer({challengePreferences} : ProfileContainerProps) {
  return (
    <div className='flex flex-col'>
      <div className='flex flex-row justify-between items-center'>
        <h1 className='font-bold text-2xl'>Challenge Level</h1>
        <Button>Save</Button>
      </div>
      <div>

      </div>
      <div className=''>

      </div>
    </div>
  )
}

export default ProfileContainer
