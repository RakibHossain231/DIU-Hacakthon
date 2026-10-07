"use client";

import React from "react";
import { TransactionInput } from "@/lib/types";
import { UserCheck, AlertOctagon, Smartphone, MapPin, Gauge, ShieldCheck, Zap } from "lucide-react";

export default function BehaviorInsights({ tx }: { tx: TransactionInput }) {
  const normalHour = "10:00 - 19:00";
  const currentHour = `${tx.hourOfDay < 10 ? '0' : ''}${tx.hourOfDay}:00`;
  const isTimeDeviating = tx.hourOfDay < 6 || tx.hourOfDay > 22;
  const isVelocityDeviating = (tx.transactionVelocity ?? 0) > 4;
  const isDeviating = isTimeDeviating || tx.isNewDevice || tx.isUnusualLocation || isVelocityDeviating || tx.amount > 20000;

  const behavioralMetrics = [
    {
      icon: <ClockIcon isDeviating={isTimeDeviating} />,
      label: "Temporal Window",
      baseline: normalHour,
      current: `${currentHour} BST`,
      isDeviating: isTimeDeviating,
      deviationText: isTimeDeviating ? "Nocturnal Dormancy Breach" : "Normal Daytime Traffic"
    },
    {
      icon: <MapPin className={`w-4 h-4 ${tx.isUnusualLocation ? "text-rose-400" : "text-emerald-400"}`} />,
      label: "Geocell Location",
      baseline: "Dhaka (Primary Cell)",
      current: tx.isUnusualLocation ? "Gazipur Tower (New Cell)" : "Dhaka Division",
      isDeviating: tx.isUnusualLocation,
      deviationText: tx.isUnusualLocation ? "Cell Tower Discrepancy" : "Expected Home District"
    },
    {
      icon: <Smartphone className={`w-4 h-4 ${tx.isNewDevice ? "text-amber-400" : "text-emerald-400"}`} />,
      label: "Hardware Fingerprint",
      baseline: "Samsung Galaxy A54 (Trusted)",
      current: tx.isNewDevice ? "Xiaomi Poco X5 (New IMEI)" : "Samsung Galaxy A54",
      isDeviating: tx.isNewDevice,
      deviationText: tx.isNewDevice ? "Unregistered Hardware Token" : "Cryptographically Signed"
    },
    {
      icon: <Gauge className={`w-4 h-4 ${isVelocityDeviating ? "text-rose-400" : "text-emerald-400"}`} />,
      label: "Burst Velocity (1h)",
      baseline: "0 - 2 txns / day",
      current: `${tx.transactionVelocity ?? 1} transactions`,
      isDeviating: isVelocityDeviating,
      deviationText: isVelocityDeviating ? "Rapid Extraction Cadence" : "Standard Frequency"
    }
  ];

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-full bg-[#0c1322]">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
              Behavioral Biometrics & Baseline
            </h3>
            <p className="text-[11px] text-slate-400">Deviation from 90-Day Historic Customer Profile</p>
          </div>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${
          isDeviating 
            ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
        }`}>
          {isDeviating ? "ANOMALY DETECTED" : "PROFILE ALIGNED"}
        </span>
      </div>

      {/* Metrics List */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-[#0c1322] to-[#080d18]">
        <div className="space-y-2.5">
          {behavioralMetrics.map((item, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-xl border transition-all duration-200 ${
                item.isDeviating 
                  ? "bg-slate-900/90 border-slate-700/80 shadow-sm" 
                  : "bg-slate-900/50 border-slate-800/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  item.isDeviating 
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" 
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}>
                  {item.deviationText}
                </span>
              </div>

              <div className="grid grid-cols-2 text-xs font-mono pt-1 border-t border-slate-800/60 mt-1">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Baseline Pattern</span>
                  <span className="text-slate-400 text-[11px]">{item.baseline}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Current Transaction</span>
                  <span className={`text-[11px] font-bold ${item.isDeviating ? "text-amber-400" : "text-emerald-400"}`}>
                    {item.current}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Anomaly Summary Alert */}
        <div className={`mt-3 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
          isDeviating 
            ? "bg-amber-950/30 border-amber-500/30 text-amber-200" 
            : "bg-emerald-950/20 border-emerald-500/30 text-emerald-200"
        }`}>
          {isDeviating ? (
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="leading-relaxed">
            <span className="font-bold">{isDeviating ? "High Deviation:" : "Clean Profile:"}</span>{" "}
            {isDeviating 
              ? "Multiple behavioral shifts trigger Isolation Forest anomaly model (Confidence: 89.4%)." 
              : "User matches verified behavioral fingerprint with zero risk anomalies."}
          </div>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ isDeviating }: { isDeviating: boolean }) {
  return (
    <svg className={`w-4 h-4 ${isDeviating ? "text-amber-400" : "text-emerald-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polyline points="12 6 12 12 16 14" strokeWidth="2" />
    </svg>
  );
}
