import { Navigate, Route, Routes } from "react-router";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";

import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
            {/* --- DECORATIVE GRID BACKGROUND --- */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f3f1a_1px,transparent_1px),linear-gradient(to_bottom,#3f3f3f1a_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* --- GRADIENT ORBS --- */}
      <div className="absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-pink-500/30 via-fuchsia-500/20 to-transparent blur-[150px] animate-pulse" />
      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-l from-cyan-500/30 via-blue-500/20 to-transparent blur-[150px] animate-pulse" />

   
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </div>
  );
}
export default App;
