import { create } from "zustand";
import toast from "react-hot-toast";

import api from "../api/axios";

const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: false,
  isSigningUP: false,
  isLoggingIn: false,

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
      const errRes = error.response?.data;

    // If there are validation errors, show the first one
        if (errRes?.errors?.length) {
          toast.error(errRes.errors[0].msg);
        } else if (errRes?.message) {
          toast.error(errRes.message);
        } else {
          toast.error("Something went wrong!");
        }    
      }
  },

  // ✅ Login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", data); // your backend route
      set({ authUser: res.data, isLoggingIn: false });
      toast.success("Login successful!");
    } catch (error) {
      console.log("Error in login:", error);
      set({ isLoggingIn: false });
            const errRes = error.response?.data;

    // If there are validation errors, show the first one 
        if (errRes?.errors?.length) {
          toast.error(errRes.errors[0].msg);
        } else if (errRes?.message) {
          toast.error(errRes.message);
        } else {
          toast.error("Login failed!");
    }
    }
  },
}));

export default useAuthStore;
