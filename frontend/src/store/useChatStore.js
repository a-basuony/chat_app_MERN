import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import axiosInstance from "../lib/axios";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages");
      // log the contancts
      console.log("getAllContacts:", res.data.data);
      set({ allContacts: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      // log the filteredChatPartners
      // console.log(res.data);
        const { authUser } = useAuthStore.getState();
        
           const filteredChats = res.data.data.filter(
              (user) => user._id !== authUser._id
            );
      set({ chats:filteredChats });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      console.log(res.data);
      // set({ messages: res.data.message });
          const fetchedMessages = res.data?.data?.messages || res.data?.data || [];
          set({ messages: Array.isArray(fetchedMessages) ? fetchedMessages : [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
  const { selectedUser } = get();
  const { authUser } = useAuthStore.getState();

  if (!selectedUser?._id) {
    toast.error("Please select a user to send message");
    return;
  }

  const tempId = `temp-${Date.now()}`;

  // ✅ Optimistic message
  const optimisticMessage = {
    _id: tempId,
    senderId: authUser._id,
    receiverId: selectedUser._id,
    text: messageData.text,
    image: messageData.image,
    createdAt: new Date().toISOString(),
    isOptimistic: true, // flag to identify optimistic message
  };

  
  try {
    // ✅ Immediately update UI
    // ✅ Add optimistic message to UI immediately
    set((state) => ({
      messages: [...(Array.isArray(state.messages) ? state.messages : []), optimisticMessage],
    }));
    // ✅ Send to backend
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    console.log("✅ sendMessage response:", res.data);

    const newMessage =
      res.data?.data?.message ||
      res.data?.data ||
      res.data?.message ||
      res.data;

    if (!newMessage) throw new Error("Invalid message response");

    // ✅ Replace optimistic message with real one
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === tempId ? newMessage : msg
      ),
    }));
  } catch (error) {
    console.error("❌ Send message failed:", error);
    // ❌ Remove the optimistic message on error
    set((state) => ({
      messages: state.messages.filter((msg) => msg._id !== tempId),
    }));
    toast.error(error.response?.data?.message || "Failed to send message");
  }
},

}));
