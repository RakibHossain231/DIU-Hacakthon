"use client";

import React from "react";
import { XAIFactor } from "@/lib/types";
import { Sparkles, HelpCircle } from "lucide-react";

export default function XAIFactors({ factors }: { factors: XAIFactor[] }) {
  if (!factors || factors.length === 0) return null;

  return (
    <div className="w-full mt-5 text-left border-t border-slate-800/80 pt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          SHAP Explainability Vectors (XAI)
        </h3>
        <span className="text-[10px] text-slate-500 font-mono">Top Influencers</span>
      </div>

      <div className="space-y-2.5">
        {factors.map((factor, idx) => {
          const isPos = factor.direction === "POSITIVE";
          const barColor = isPos ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-gradient-to-r from-emerald-500 to-teal-400";
          const sign = isPos ? "+" : "-";

          return (
            <div key={idx} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 group">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {factor.label}
                </span>
                <span className={`font-mono font-bold text-[11px] ${isPos ? "text-rose-400" : "text-emerald-400"}`}>
                  {sign}{factor.weight}%
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/50">
                <div 
                  className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`} 
                  style={{ width: `${Math.min(Math.max(factor.weight, 5), 100)}%` }}
                />
              </div>

              <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                {factor.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
