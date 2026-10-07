"use client";

import { useState } from "react";
import IntelligenceDashboard from "@/components/IntelligenceDashboard";
import OperationsQueue from "@/components/OperationsQueue";
import CommandCenter from "@/components/CommandCenter";
import { CasesProvider, useCases } from "@/lib/casesStore";
import { Activity, ShieldAlert, BarChart3, Radio } from "lucide-react";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState<"SIMULATOR" | "OPERATIONS" | "COMMAND_CENTER">("SIMULATOR");
  const { cases } = useCases();
  const openCasesCount = cases.filter(c => c.status !== "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Navigation Command Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-[#0b1120]/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab("SIMULATOR")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
              activeTab === "SIMULATOR"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Threat Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("OPERATIONS")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer relative ${
              activeTab === "OPERATIONS"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Operations & Cases</span>
            {openCasesCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                activeTab === "OPERATIONS" ? "bg-white text-blue-900" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}>
                {openCasesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("COMMAND_CENTER")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer ${
              activeTab === "COMMAND_CENTER"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Executive Command Center</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 pr-3 text-xs text-slate-400 font-mono">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-[11px] text-slate-300 font-semibold">FEED: SYNTHETIC MFS NETWORK</span>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "SIMULATOR" && (
        <IntelligenceDashboard onNavigateToOps={() => setActiveTab("OPERATIONS")} />
      )}
      {activeTab === "OPERATIONS" && <OperationsQueue />}
      {activeTab === "COMMAND_CENTER" && <CommandCenter />}
    </div>
  );
}

export default function Dashboard() {
  return (
    <CasesProvider>
      <DashboardContent />
    </CasesProvider>
  );
}
