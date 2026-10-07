"use client";

import React from "react";
import { RecommendedAction } from "@/lib/types";
import { CheckCircle2, ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

export default function RecommendationCard({ action }: { action: RecommendedAction }) {
  let config = {
    bg: "bg-emerald-950/40",
    border: "border-emerald-500/40",
    glow: "glow-green",
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />,
    title: "AUTO APPROVE TRANSACTION",
    titleColor: "text-emerald-300",
    badge: "LOW FRICTION",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    reason: "Transaction metrics align fully with benign consumer profile. Zero friction clearance.",
  };

  if (action === "BLOCK_AND_ESCALATE") {
    config = {
      bg: "bg-rose-950/40",
      border: "border-rose-500/40",
      glow: "glow-red",
      icon: <ShieldAlert className="w-5 h-5 text-rose-400 mt-0.5 shrink-0 animate-pulse" />,
      title: "BLOCK & IMMEDIATE ESCALATION",
      titleColor: "text-rose-300",
      badge: "CRITICAL THREAT",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      reason: "High-probability fraud heuristics detected. Intercept withdrawal & pipe to operations queue.",
    };
  } else if (action === "CHALLENGE_OTP_BIOMETRIC") {
    config = {
      bg: "bg-amber-950/40",
      border: "border-amber-500/40",
      glow: "glow-amber",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />,
      title: "STEP-UP AUTHENTICATION (OTP + FACE KYC)",
      titleColor: "text-amber-300",
      badge: "VERIFICATION REQUIRED",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      reason: "Moderate anomaly signals detected. Prompt secondary biometric challenge to confirm customer intent.",
    };
  }

  return (
    <div className={`w-full rounded-2xl border p-4 ${config.bg} ${config.border} flex flex-col space-y-3 shadow-xl backdrop-blur-md transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Recommended Policy Action
        </h3>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border font-mono ${config.badgeColor}`}>
          {config.badge}
        </span>
      </div>

      <div className="flex items-start space-x-3">
        {config.icon}
        <div>
          <h4 className={`text-sm font-extrabold tracking-wide ${config.titleColor}`}>
            {config.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {config.reason}
          </p>
        </div>
      </div>
    </div>
  );
}
