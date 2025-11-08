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
      set({ authUser: res.data.data.user, isCheckingAuth: false });
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
set({ authUser: res.data.data.user, isLoggingIn: false });
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
      set({ authUser: res.data.data.user, isLoggingIn: false });

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

  // ✅ Logout
  logout: async () => {
    try {
      await api.post("/auth/logout"); // your backend route
      set({ authUser: null });
      toast.success("Logout successful!");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Logout failed!");
    }
  },

  // ✅ Update User
  updateProfile: async (data) => {
    try {
      const res = await api.put("/auth/update-profile", data); // your backend route
      set({ authUser: res.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log("Error in updateUser:", error);
      const errRes = error.response?.data;
      if (errRes?.errors?.length) {
        toast.error(errRes.errors[0].msg);
      } else if (errRes?.message) {
        toast.error(errRes.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  },
}));

export default useAuthStore;
