import { create } from "zustand";
import toast from "react-hot-toast";

import api from "../api/axios";

const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUP: false,

  // ✅ Check Auth (for persisted session)
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/auth/check"); // your backend route
      set({ authUser: res.data.user, isCheckingAuth: false });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  // ✅ Signup
  signup: async (data) => {
    set({ isSigningUP: true });
    try {
      const res = await api.post("/auth/signup", data); // your backend route
      set({ authUser: res.data, isSigningUP: false });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error in signup:", error);
      set({ isSigningUP: false });
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  },
}));

export default useAuthStore;
