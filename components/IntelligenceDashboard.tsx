"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, Search, Server, Cpu, Layers, Sparkles, PlusCircle } from "lucide-react";
import { TransactionInput } from "@/lib/types";
import { analyzeTransaction, MLInferenceResult } from "@/lib/riskEngine";
import { useCases } from "@/lib/casesStore";
import RiskScore from "./RiskScore";
import XAIFactors from "./XAIFactors";
import RecommendationCard from "./RecommendationCard";
import KPICards from "./KPICards";
import BehaviorInsights from "./BehaviorInsights";
import NetworkGraph from "./NetworkGraph";
import InvestigationDrawer from "./InvestigationDrawer";

const PRESETS = {
  NORMAL: {
    label: "Safe Send Money",
    desc: "Everyday P2P transfer",
    data: { amount: 1500, type: "SEND_MONEY" as const, hourOfDay: 14, isNewDevice: false, isUnusualLocation: false, accountAgeDays: 900, receiverIsNew: false, transactionVelocity: 1 }
  },
  SIM_SWAP: {
    label: "Midnight SIM-Swap ATO",
    desc: "3:00 AM Cash-out with new IMEI",
    data: { amount: 25000, type: "CASH_OUT" as const, hourOfDay: 3, isNewDevice: true, isUnusualLocation: true, accountAgeDays: 45, receiverIsNew: true, transactionVelocity: 14 }
  },
  MULE: {
    label: "Mule Funneling Ring",
    desc: "Rapid multi-hop extraction",
    data: { amount: 48500, type: "SEND_MONEY" as const, hourOfDay: 2, isNewDevice: true, isUnusualLocation: true, accountAgeDays: 14, receiverIsNew: true, transactionVelocity: 24 }
  },
  REFUND_SCAM: {
    label: "Wrong-Number Scam",
    desc: "Urgent refund social engineering",
    data: { amount: 18500, type: "CASH_OUT" as const, hourOfDay: 16, isNewDevice: false, isUnusualLocation: true, accountAgeDays: 120, receiverIsNew: true, transactionVelocity: 7 }
  }
};

export default function IntelligenceDashboard({ onNavigateToOps }: { onNavigateToOps?: () => void }) {
  const { addCase } = useCases();
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>("NORMAL");

  const [txInput, setTxInput] = useState<TransactionInput>({
    senderAccount: "AC••••4912",
    receiverAccount: "AC••••8830",
    ...PRESETS.NORMAL.data
  });

  const [riskOutput, setRiskOutput] = useState<MLInferenceResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchRisk = async () => {
      setIsLoading(true);
      const output = await analyzeTransaction(txInput);
      if (!active) return;
      if (output) {
        setRiskOutput(output);
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(fetchRisk, 120);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [txInput]);

  const handleInputChange = (field: keyof TransactionInput, value: any) => {
    setTxInput(prev => ({ ...prev, [field]: value }));
  };

  const loadPreset = (key: keyof typeof PRESETS) => {
    setActivePreset(key);
    setTxInput(prev => ({ ...prev, ...PRESETS[key].data }));
  };

  const handleQuickEscalate = () => {
    if (!riskOutput) return;
    const caseId = `CASE-2026-${Math.floor(Math.random() * 900 + 100)}`;
    addCase({
      caseId,
      scenarioLabel: PRESETS[activePreset]?.label || "Live Simulator Alert",
      transaction: { ...txInput, id: "TXN-" + Date.now().toString().slice(-6), timestamp: new Date().toISOString() },
      riskAssessment: riskOutput,
      status: "NEW",
      assignedTo: "Risk Operations Queue",
      disposition: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [
        { id: "init-note", text: `Auto-escalated from Live Threat Simulator (${PRESETS[activePreset]?.label}) with Risk Score ${riskOutput.finalRiskScore}%.`, author: "Threat Simulator", timestamp: new Date().toISOString() }
      ],
      auditEvents: [
        { id: "e-init", timestamp: new Date().toISOString(), action: "Case generated from simulator", actor: "Threat Analyst" }
      ]
    });
    onNavigateToOps?.();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Real-time Threat Intelligence Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Simulate MFS transactions and test multi-layered ML detection with instant SHAP explanations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleQuickEscalate}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/30 transition-all border border-blue-400/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Escalate To Cases Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KPICards />

      {/* Model Architecture & Status Ribbon */}
      <div className="cyber-card rounded-2xl p-3 sm:p-4 border border-slate-800 shadow-xl flex flex-wrap gap-3 items-center justify-between text-xs text-slate-400 bg-[#0c1322]">
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-slate-300 uppercase tracking-widest">
          <Server className="w-4 h-4 text-cyan-400" />
          ACTIVE ML ENSEMBLE:
        </div>
        
        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            XGBoost Classifier <span className="text-emerald-400 font-bold ml-1">v1.4</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Isolation Forest <span className="text-emerald-400 font-bold ml-1">v1.2</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Graph Network <span className="text-emerald-400 font-bold ml-1">v2.0</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SHAP Explainer <span className="text-cyan-400 font-bold ml-1">TreeXAI</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Simulator + Visualizers | Right: Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Left Column (8 cols): Controls, Behavior, Network Graph */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Attack Simulator Card */}
          <section className="cyber-card rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl bg-[#0c1322]">
            {/* Header & Presets */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 mb-5 gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 text-cyan-400 rounded-xl border border-blue-500/20">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Transaction Vector Controls
                  </h3>
                  <p className="text-[11px] text-slate-400">Select real-world MFS attack patterns or tune variables</p>
                </div>
              </div>

              {/* Scenario Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((key) => {
                  const preset = PRESETS[key];
                  const isActive = activePreset === key;
                  return (
                    <button
                      key={key}
                      onClick={() => loadPreset(key)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30"
                          : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders and Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Amount */}
              <div className="space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Transaction Amount</span>
                  <span className="font-mono font-bold text-cyan-400 text-sm">৳{txInput.amount.toLocaleString()} BDT</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={txInput.amount}
                  onChange={(e) => handleInputChange("amount", Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>৳100</span>
                  <span>Max Cap: ৳50,000</span>
                </div>
              </div>

              {/* Hour of Day */}
              <div className="space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Time of Transaction</span>
                  <span className={`font-mono font-bold text-sm ${txInput.hourOfDay >= 1 && txInput.hourOfDay <= 5 ? "text-rose-400" : "text-slate-200"}`}>
                    {txInput.hourOfDay < 10 ? `0${txInput.hourOfDay}` : txInput.hourOfDay}:00 BST
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={txInput.hourOfDay}
                  onChange={(e) => handleInputChange("hourOfDay", Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>00:00 (Midnight)</span>
                  <span>23:00</span>
                </div>
              </div>

              {/* Account Age */}
              <div className="space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Account Age</span>
                  <span className="font-mono font-bold text-slate-200 text-sm">{txInput.accountAgeDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={txInput.accountAgeDays}
                  onChange={(e) => handleInputChange("accountAgeDays", Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 Day (Fresh)</span>
                  <span>1000 Days</span>
                </div>
              </div>

              {/* Velocity */}
              <div className="space-y-2 p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Velocity (Past Hour)</span>
                  <span className={`font-mono font-bold text-sm ${(txInput.transactionVelocity ?? 0) > 8 ? "text-rose-400" : "text-slate-200"}`}>
                    {txInput.transactionVelocity} txns / hr
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={txInput.transactionVelocity}
                  onChange={(e) => handleInputChange("transactionVelocity", Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 txns</span>
                  <span>30 txns / hr</span>
                </div>
              </div>

              {/* Transaction Type */}
              <div className="space-y-1.5 p-3 bg-slate-900/50 rounded-xl border border-slate-800/60">
                <label className="text-xs font-semibold text-slate-300 block">
                  MFS Channel Type
                </label>
                <select
                  value={txInput.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 outline-none focus:border-cyan-500 font-mono cursor-pointer"
                >
                  <option value="SEND_MONEY">SEND MONEY (P2P)</option>
                  <option value="CASH_OUT">CASH OUT (Agent / ATM)</option>
                  <option value="MERCHANT_PAY">MERCHANT PAY (QR Code)</option>
                  <option value="AIRTIME">AIRTIME RECHARGE</option>
                </select>
              </div>

              {/* Device & Location Flags */}
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/60 flex flex-col justify-center space-y-2.5">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={txInput.isNewDevice}
                    onChange={(e) => handleInputChange("isNewDevice", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-300">New Hardware IMEI / Device</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={txInput.isUnusualLocation}
                    onChange={(e) => handleInputChange("isUnusualLocation", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-300">Unusual Location / Tower Jump</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={txInput.receiverIsNew}
                    onChange={(e) => handleInputChange("receiverIsNew", e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-300">First-Time Recipient Wallet</span>
                </label>
              </div>
            </div>
          </section>

          {/* Behavior Insights & Topological Network Graph */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BehaviorInsights tx={txInput} />
            <NetworkGraph tx={txInput} />
          </div>
        </div>

        {/* Right Column (4 cols): Model Risk Output & Actions */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          
          {riskOutput && (
            <section className={`cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl flex flex-col bg-[#0c1322] transition-opacity duration-200 ${isLoading ? 'opacity-70' : 'opacity-100'}`}>
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-widest">
                    Multi-Model Fusion Engine
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  LIVE
                </span>
              </div>

              {/* Sub-model Scores */}
              <div className="space-y-2 mb-4 font-mono text-xs">
                <div className="flex justify-between items-center bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span> Supervised Fraud (XGBoost)
                  </span>
                  <span className="font-bold text-white">{riskOutput.fraudProbability}%</span>
                </div>

                <div className="flex justify-between items-center bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Behavior Anomaly (IForest)
                  </span>
                  <span className="font-bold text-white">{riskOutput.anomalyScore}%</span>
                </div>

                <div className="flex justify-between items-center bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Graph Mule Network
                  </span>
                  <span className="font-bold text-white">{riskOutput.networkRiskScore}%</span>
                </div>
              </div>

              {/* Circular Gauge */}
              <div className="py-2 border-t border-slate-800/80">
                <RiskScore score={riskOutput.finalRiskScore} level={riskOutput.riskLevel} />
              </div>

              {/* SHAP Factors */}
              <XAIFactors factors={riskOutput.xaiFactors} />
            </section>
          )}

          {/* Policy Recommendation & Drawer Trigger */}
          {riskOutput && (
            <div className="space-y-3">
              <RecommendationCard action={riskOutput.recommendedAction} />

              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                Open AI Forensic Investigation
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Investigation Drawer */}
      <InvestigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        tx={txInput}
        riskOutput={riskOutput as any}
        onCreateCase={() => {
          setIsDrawerOpen(false);
          handleQuickEscalate();
        }}
      />
    </div>
  );
}
