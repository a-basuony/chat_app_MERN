import React from "react";
import useAuthStore from "../store/useAuthStore";

const ChatPage = () => {
  const {logout} = useAuthStore()
  return <div className=" z-10w-full flex items-center justify-center p-4  bg-slate-900">
    <button onClick={logout}>Logout</button>
  </div>;
};

export default ChatPage;
