import {create } from "zustand";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    // get it from local storage
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

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
            const res = await api.get("/messages"); // your backend route
            set({ allContacts: res.data });
        } catch (error) {
            console.log("Error in getAllContacts:", error);
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getAllChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await api.get("/messages"); // your backend route
            set({ allContacts: res.data });
        } catch (error) {
            console.log("Error in getAllContacts:", error);
        } finally {
            set({ isUsersLoading: false });
        }2
    },
}))