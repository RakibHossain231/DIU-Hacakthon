"use client";

import React from "react";
import { Activity, ShieldCheck, AlertTriangle, TrendingUp, DollarSign, Cpu } from "lucide-react";
import { useCases } from "@/lib/casesStore";

export default function KPICards() {
  const { cases } = useCases();
  const openCasesCount = cases.filter(c => c.status !== "RESOLVED").length;
  const criticalCount = cases.filter(c => c.riskAssessment?.riskLevel === "CRITICAL" && c.status !== "RESOLVED").length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI 1 */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Monitored 24h Flow
          </div>
          <div className="p-2 bg-blue-500/10 text-cyan-400 rounded-xl border border-blue-500/20">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            ৳18,450,000
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1.5 font-medium font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2%</span>
            <span className="text-slate-500 font-sans">vs prev 24h</span>
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Fraud Loss Prevented
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight font-mono">
            ৳2,850,000
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 font-medium">
            <span className="text-emerald-400 font-mono font-bold">142</span>
            <span>Intercepted malicious drains</span>
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            AI Model Accuracy
          </div>
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
            99.4%
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5 font-medium font-mono">
            <span className="text-purple-400 font-bold">AUC 0.982</span>
            <span className="text-slate-500">• FPR 0.8%</span>
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className="cyber-card rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Active Investigations
          </div>
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono flex items-baseline gap-2">
            <span>{openCasesCount}</span>
            <span className="text-xs font-mono font-bold text-rose-400">({criticalCount} Critical)</span>
          </div>
          <div className="text-xs text-slate-400 mt-1.5 font-medium">
            Pending analyst resolution in CRM
          </div>
        </div>
      </div>
    </section>
  );
}
