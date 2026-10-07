"use client";

import React from "react";
import { RiskLevel } from "@/lib/types";
import { ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

interface RiskScoreProps {
  score: number;
  level: RiskLevel;
}

export default function RiskScore({ score, level }: RiskScoreProps) {
  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let colorStroke = "#10b981"; // emerald
  let glowClass = "glow-green";
  let badgeBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let Icon = ShieldCheck;

  if (level === "CRITICAL") {
    colorStroke = "#ef4444"; // red
    glowClass = "glow-red";
    badgeBg = "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse";
    Icon = ShieldAlert;
  } else if (level === "MODERATE") {
    colorStroke = "#f59e0b"; // amber
    glowClass = "glow-amber";
    badgeBg = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    Icon = AlertTriangle;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 w-full py-2">
      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> Fused AI Risk Index
      </div>

      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 transition-transform duration-1000 ease-out"
        >
          {/* Background Ring */}
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Ring with Glow */}
          <circle
            stroke={colorStroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
            {Math.round(score)}<span className="text-base text-slate-400">%</span>
          </span>
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
            Risk Prob
          </span>
        </div>
      </div>

      {/* Level Badge */}
      <div className={`px-4 py-1 rounded-full font-extrabold text-xs tracking-wider uppercase border ${badgeBg}`}>
        {level} RISK
      </div>
    </div>
  );
}
