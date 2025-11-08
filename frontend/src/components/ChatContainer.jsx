import React, { useEffect } from 'react'
import useAuthStore from './../store/useAuthStore';
import ChatHeader from './ChatHeader'
import { useChatStore } from './../store/useChatStore';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';

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
    <div className="flex-1 px-6 overflow-y-auto py-8">
      {messages.length > 0 ? (
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message._id}
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className={`chat-bubble  relative ${message.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                  {message.image && (
                    <img src={message.image} alt={message.text} className='rounded-lg h-48 object-cover'/>
                  )}
                  {message.text && <p className='mt-2'>{message.text}</p>}
                </div>
              </div>
          ))}
        </div>
      ): (
        <NoChatHistoryPlaceholder name={selectedUser.name} />
      )}
    </div>
    {/* <ChatMessages/>
    <ChatInput/> */}
    </>
  )
}

export default ChatContainer