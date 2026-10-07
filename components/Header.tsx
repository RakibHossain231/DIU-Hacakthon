"use client";

import React, { useState, useEffect } from "react";
import { Shield, Activity, Clock, Cpu, Lock, CheckCircle2 } from "lucide-react";

export default function Header() {
  const [time, setTime] = useState<string>("");
  const [latency, setLatency] = useState<number>(34);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 12) + 26); // realistic sub-40ms latency
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(latencyInterval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1120]/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0b1120]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  upay<span className="text-cyan-400">Shield</span>
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  v2.4 PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Autonomous Trust & Risk Intelligence • Bangladesh MFS
              </p>
            </div>
          </div>

          {/* Real-time Telemetry & Security Chips */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono">
            {/* Clock */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900/90 text-slate-300 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px]">{time || "00:00:00"} <span className="text-slate-500 text-[10px]">BST</span></span>
            </div>

            {/* Inference Engine Status */}
            <div className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-950/40 text-emerald-300 rounded-lg border border-emerald-500/30 shadow-sm shadow-emerald-950/50">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-semibold text-[11px] tracking-wide whitespace-nowrap">
                FUSION ENGINE <span className="hidden md:inline">• {latency}ms</span>
              </span>
            </div>

            {/* Regulatory Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-950/40 text-indigo-300 rounded-lg border border-indigo-500/30">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-medium tracking-wide whitespace-nowrap">
                BFIU / AML READY
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
