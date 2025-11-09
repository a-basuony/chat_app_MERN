import {create } from "zustand";
import api from "../api/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    // get it from local storage
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") )=== true, // or without JSON.parse() but it will be a string === "true" as string

    toggleSound: () =>{
        // update local storage and state
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
        set({isSoundEnabled: !get().isSoundEnabled})
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser: selectedUser }),

    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/messages");// get all contacts // your backend route
            set({ allContacts: res.data.data });
        } catch (error) {
            console.log("Error in getAllContacts:", error);
            toast.error(error.response.data.message);

        } finally {
            set({ isUsersLoading: false });
        }
    },
    getAllChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/messages/chats"); // your backend route
            set({ chats: res.data.data || [] });
        } catch (error) {
            console.log("Error in getAllContacts:", error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            set({ isUsersLoading: false });
        }
    },
    

    getMessagesByUserId: async (userId)=>{
        set({isMessagesLoading: true})
        try {
            const res = await api.get(`/messages/${userId}`); // your backend route
            set({messages: res.data.data})

        } catch (error) {
            console.log("Error in getMessagesByUserId:", error);
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async(data)=>{
        const {selectedUser} = get()
        try {
            const res = await api.post(`/messages/send/${selectedUser._id}`, data);
            set({messages: [...get().messages, res.data.data]})
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }
}))