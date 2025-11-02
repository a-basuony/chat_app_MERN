import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-950 overflow-hidden z-[9999] animate-fadeIn">
      {/* === BACKGROUND GRID & LIGHTS === */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* === FLOATING COLOR BLOBS === */}
      <div className="absolute -top-48 -left-24 h-[650px] w-[650px] rounded-full bg-gradient-to-tr from-pink-500/30 via-fuchsia-500/20 to-transparent blur-[180px] animate-float1" />
      <div className="absolute -bottom-48 -right-24 h-[650px] w-[650px] rounded-full bg-gradient-to-bl from-cyan-500/30 via-blue-500/20 to-transparent blur-[180px] animate-float2" />

      {/* === PULSE GLOW RING === */}
      <div className="absolute h-[320px] w-[320px] rounded-full bg-gradient-to-tr from-fuchsia-500/10 via-cyan-500/10 to-transparent blur-3xl animate-pulseGlow" />

      {/* === SPINNER & TEXT === */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* GLOWING SPINNER */}
        <div className="relative h-20 w-20 mb-6">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-fuchsia-500 border-r-cyan-500 animate-spin-slow" />
          {/* Middle glow aura */}
          <div className="absolute inset-[6px] rounded-full bg-gradient-to-tr from-fuchsia-500/40 to-cyan-500/40 blur-md" />
          {/* Replace the flat dark circle with a glowing core */}
          <div className="absolute inset-[14px] rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.3),0_0_40px_rgba(6,182,212,0.3)]" />
          {/* Inner pulse (light core) */}
          <div className="absolute inset-[20px] rounded-full bg-gradient-to-tr from-cyan-400/30 to-pink-400/30 blur-sm animate-corePulse" />
        </div>

        {/* LOADING TEXT */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.25em] bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-textShimmer uppercase">
          Loading<span className="inline-block animate-dots"></span>
        </h1>
        <p className="mt-3 text-slate-400 text-sm uppercase tracking-[0.35em] animate-pulse">
          Please wait
        </p>
      </div>

      {/* === KEYFRAMES === */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(40px, -60px) rotate(10deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-30px, 50px) rotate(-8deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes corePulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes dots {
          0% { content: ''; }
          25% { content: '.'; }
          50% { content: '..'; }
          75% { content: '...'; }
          100% { content: ''; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.25); }
        }
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .animate-float1 { animation: float1 14s ease-in-out infinite; }
        .animate-float2 { animation: float2 12s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 2.8s linear infinite; }
        .animate-corePulse { animation: corePulse 3s ease-in-out infinite; }
        .animate-dots::after {
          display: inline-block;
          animation: dots 1.5s steps(1,end) infinite;
          content: '';
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-pulseGlow { animation: pulseGlow 6s ease-in-out infinite; }
        .animate-textShimmer {
          background-size: 200% auto;
          animation: textShimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
