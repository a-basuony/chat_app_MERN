import React, { useEffect } from 'react'
import useAuthStore from './../store/useAuthStore';
import ChatHeader from './ChatHeader'
import { useChatStore } from './../store/useChatStore';

const ChatContainer = () => {
  const {selectedUser , getMessagesByUserId, messages} = useChatStore()
  const {authUser} = useAuthStore()

  useEffect(() => {
    if(selectedUser) getMessagesByUserId(selectedUser._id)
      console.log(selectedUser)
  }, [selectedUser, getMessagesByUserId])
  if (!selectedUser) return null; // ✅ safety check

  
  return (
    <>
    <ChatHeader/>
    {/* <ChatMessages/>
    <ChatInput/> */}
    </>
  )
}

export default ChatContainer