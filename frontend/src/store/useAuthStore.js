import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import {io} from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  // socket
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      console.log("authenticated User:",res.data.data);
      set({ authUser: res.data.data });
      // connect socket
      get().connectSocket()

    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.data });
      toast.success("Account created successfully!");

      // connect socket
        get().connectSocket()


    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.data });

      toast.success("Logged in successfully");
      // connect socket
      get().connectSocket()


    } catch (error) {

      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");

      // disconnect socket
      get().disconnectSocket()
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () =>{
    // if user is authenticated
    const {authUser} = get()
    if(!authUser || get().socket?.connected) return

    // connect socket
    const socket = io(BASE_URL, {
      withCredentials: true,// this ensures that cookies are sent with the request
    })

    // call connect method
    socket.connect()

    // set socket state
    set({socket}) 

    // listen for online users events
    socket.on("getOnlineUsers", (userIds)=>{
      set({onlineUsers: userIds})
    })
    
    socket.on("newMessage", (message) => {
      console.log("📩 New message received:", message);
      // You can update your chat store directly here, or through a global event bus
    });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  googleAuth: async (googleToken) => {
  try {
    const res = await axiosInstance.post("/auth/google", { token: googleToken });
    console.log("Google auth data:", res.data.data);
     set({ authUser: res.data.data });
      toast.success("Logged in successfully");
      // connect socket
      get().connectSocket()

    toast.success("Logged in with Google!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Google login failed");
  }
},
}));
