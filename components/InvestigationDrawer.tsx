"use client";

import React, { useEffect, useState } from "react";
import { X, Search, ShieldCheck, Clock, CheckCircle2, ShieldAlert, AlertTriangle, Activity, Sparkles, FileText, ChevronDown, Check, ArrowRight } from "lucide-react";
import { TransactionInput } from "@/lib/types";
import { MLInferenceResult } from "@/lib/riskEngine";
import { useCases } from "@/lib/casesStore";
import XAIFactors from "./XAIFactors";
import NetworkGraph from "./NetworkGraph";

interface InvestigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tx: TransactionInput;
  riskOutput: MLInferenceResult | null;
  onCreateCase?: () => void;
}

export default function InvestigationDrawer({ isOpen, onClose, tx, riskOutput, onCreateCase }: InvestigationDrawerProps) {
  const [timestamp, setTimestamp] = useState("");
  const { addCase } = useCases();

  useEffect(() => {
    if (isOpen) {
      setTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [isOpen]);

  if (!isOpen || !riskOutput) return null;

  // AI-generated forensic brief
  let narrative = "Transaction conforms with typical daytime spending patterns. Historical counterparty trust established. No anomalous deviations observed.";
  if (riskOutput.riskLevel === "CRITICAL") {
    narrative = `Forensic assessment indicates a high-probability attack signature (ATO / Mule funnelling). Primary drivers include ${riskOutput.xaiFactors.map(f => f.label.toLowerCase()).slice(0, 2).join(" accompanied by ")}. Intercepting withdrawal prevents estimated loss of ৳${tx.amount.toLocaleString()} BDT.`;
  } else if (riskOutput.riskLevel === "MODERATE") {
    narrative = `Transaction triggered moderate anomaly thresholds due to first-time transfer destination and sudden velocity deviation. Recommend progressive identity challenge prior to fund release.`;
  }

  const isCritical = riskOutput.riskLevel === "CRITICAL";
  const isModerate = riskOutput.riskLevel === "MODERATE";

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[90] transition-opacity" 
        onClick={onClose} 
      />
      
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-[#0c1322] shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-800 text-slate-100 overflow-hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* HEADER */}
        <div className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-cyan-400 rounded-lg">
                <Search className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                AI Forensic Investigation Workbench
              </h2>
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold tracking-wider rounded border border-indigo-500/20 uppercase">
                BFIU Audit Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Wallet: {tx.senderAccount} • Time: {timestamp} BST
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Threat Score
              </div>
              <div className={`text-lg font-mono font-extrabold ${
                isCritical ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {riskOutput.finalRiskScore}% • {riskOutput.riskLevel}
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          
          {/* AI Forensic Brief */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                AI Forensic Incident Narrative
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {narrative}
            </p>
          </div>

          {/* 1. Transaction Telemetry */}
          <section className="cyber-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60">
            <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3 font-mono">
              1. Transaction Telemetry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Amount</span>
                <span className="text-base font-extrabold text-white">৳{tx.amount.toLocaleString()}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Channel</span>
                <span className="text-sm font-bold text-cyan-400">{tx.type}</span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Velocity (1h)</span>
                <span className={`text-sm font-bold ${(tx.transactionVelocity ?? 0) > 8 ? "text-rose-400" : "text-white"}`}>
                  {tx.transactionVelocity ?? 1} txns
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 uppercase block">Hour</span>
                <span className="text-sm font-bold text-white">{tx.hourOfDay}:00 BST</span>
              </div>
            </div>
          </section>

          {/* 2. Top XAI Influence Drivers */}
          <section className="cyber-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60">
            <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 font-mono">
              2. SHAP Explainability Decomposition
            </h3>
            <XAIFactors factors={riskOutput.xaiFactors} />
          </section>

          {/* 3. Topological Network Route */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-3 font-mono">
              3. Graph Topology Path
            </h3>
            <NetworkGraph tx={tx} />
          </section>

          {/* 4. Regulatory & Policy Decision */}
          <section className="cyber-card rounded-2xl p-5 border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                System Recommendation
              </span>
              <div className="text-sm font-extrabold text-white font-mono mt-0.5">
                {riskOutput.recommendedAction.replace(/_/g, " ")}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Policy enforces human confirmation prior to permanent account freezing.
              </p>
            </div>

            <button
              onClick={() => {
                onCreateCase?.();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold font-mono text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30 cursor-pointer shrink-0"
            >
              + Escalate to Case Management
            </button>
          </section>

        </div>
      </div>
    </>
  );
}
