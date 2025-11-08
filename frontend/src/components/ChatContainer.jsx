import React, { useEffect } from 'react'
import useAuthStore from './../store/useAuthStore';
import ChatHeader from './ChatHeader'
import { useChatStore } from './../store/useChatStore';
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder';
import MessagesLoadingSkeleton from './MessagesLoadingSkeleton';
import MessageInput from './MessageInput';

const ChatContainer = () => {
  const {selectedUser , getMessagesByUserId, messages, isMessagesLoading} = useChatStore()
  const {authUser} = useAuthStore()

  useEffect(() => {
    if(selectedUser) getMessagesByUserId(selectedUser._id)
      console.log(selectedUser)
  }, [selectedUser, getMessagesByUserId])

  
  return (
    <>
    <ChatHeader/>
      {/* chat messages */}
    <div className="flex-1 px-6 overflow-y-auto py-8">
      {messages.length > 0 && !isMessagesLoading ? (
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
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(message.createdAt).toISOString().slice(11, 16)}
                  </p>
                </div>
              </div>
          ))}
        </div>
      ): isMessagesLoading ? <MessagesLoadingSkeleton/> :(
        <NoChatHistoryPlaceholder name={selectedUser?.name} />
      )}
    </div>
  {/* chat input */}
    <MessageInput/>
    </>
  )
}

export default ChatContainer