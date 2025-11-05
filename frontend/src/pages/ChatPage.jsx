import React from "react";
import { useChatStore } from "../store/useChatStore";
import ActiveTabSwitch from './../components/ActiveTabSwitch';
import ProfileHeader from './../components/ProfileHeader';
import ChatList from "../components/ChatList";
import ContactsList from "../components/ContactsList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from './../components/NoConversationPlaceholder';
import BorderAnimatedContainer from './../components/BorderAnimatedContainer';

const ChatPage = () => {
  const {activeTab, selectedUser} = useChatStore()
  return <div className="relative w-full max-w-6xl h-[800px]">
    <BorderAnimatedContainer>
      <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">

      {/* LEFT SIDEBAR */}
      <ProfileHeader/>
      <ActiveTabSwitch/>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {activeTab=== "chats"? <ChatList/>: <ContactsList/>}
      </div>

      </div>
      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        {selectedUser? <ChatContainer/> : <NoConversationPlaceholder/>}
      </div>
    </BorderAnimatedContainer>
  </div>;
};

export default ChatPage;
