import React, { useRef, useState } from 'react'
import useAuthStore from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'

const ProfileHeader = () => {
  const {logout, authUser} = useAuthStore()
  const {isSoundEnabled, toggleSound} = useChatStore()
  const {selectedImg, setSelectedImg} = useState(null)

  const fileInputRef = useRef(null)

  const handleImageUpload= (e) =>{
    const file = e.target.files[0]
    setSelectedImg(file)
  }
  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3"> <h1>Profile</h1> <p>hhhh</p></div>
      </div>
    </div>
  )
}

export default ProfileHeader