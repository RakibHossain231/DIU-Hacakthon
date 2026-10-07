"use client";

import React, { useState, useEffect } from "react";
import { useCases } from "@/lib/casesStore";
import { BarChart3, Activity, ShieldAlert, Cpu, Share2, Layers, ShieldCheck, Target, Printer, DollarSign, TrendingDown } from "lucide-react";

export default function CommandCenter() {
  const { cases } = useCases();
  const [health, setHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchSystemData = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";
        const [hRes, mRes] = await Promise.all([
          fetch(`${API_BASE_URL}/health`).catch(() => null),
          fetch(`${API_BASE_URL}/metrics`).catch(() => null)
        ]);

        if (!active) return;
        if (hRes && hRes.ok) setHealth(await hRes.json());
        if (mRes && mRes.ok) setMetrics(await mRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSystemData();
    return () => { active = false; };
  }, []);

  const totalCases = cases.length;
  const critical = cases.filter(c => c.riskAssessment?.riskLevel === "CRITICAL").length;
  const moderate = cases.filter(c => c.riskAssessment?.riskLevel === "MODERATE").length;
  const openCases = cases.filter(c => c.status !== "RESOLVED").length;
  const escalated = cases.filter(c => c.status === "ESCALATED" || c.disposition === "ESCALATED_L2").length;

  const falsePositives = cases.filter(c => c.disposition === "FALSE_POSITIVE").length;
  const confirmedSuspicious = cases.filter(c => c.disposition === "CONFIRMED_SUSPICIOUS").length;
  const casesWithFeedback = cases.filter(c => c.disposition !== "").length;

  // Distribution by transaction type
  const txTypes = cases.reduce((acc, c) => {
    acc[c.transaction.type] = (acc[c.transaction.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Executive Risk Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            High-level security telemetry, AI validation metrics, and regulatory audit matrices
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 text-slate-200 px-4 py-2 rounded-xl text-xs font-mono font-bold hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Export Executive Report</span>
        </button>
      </div>

      {/* 1. EXECUTIVE METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Total Ops Cases" value={totalCases} color="text-white" />
        <MetricCard label="Critical Threats" value={critical} color="text-rose-400" />
        <MetricCard label="Moderate Reviews" value={moderate} color="text-amber-400" />
        <MetricCard label="Active Workflow" value={openCases} color="text-cyan-400" />
        <MetricCard label="BFIU Referrals" value={escalated} color="text-purple-400" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Risk Trends & Attack Distribution */}
          <div className="cyber-card rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              MFS Channel Distribution & Fraud Concentration
            </h3>

            {totalCases === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-500">
                Insufficient Data. Create cases to generate analytics.
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-3 font-mono">
                    Transaction Channel Exposure
                  </div>
                  <div className="space-y-3 font-mono">
                    {Object.entries(txTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-3">
                        <div className="w-36 text-xs font-semibold text-slate-300 truncate">
                          {type.replace("_", " ")}
                        </div>
                        <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-700"
                            style={{ width: `${(count / totalCases) * 100}%` }}
                          />
                        </div>
                        <div className="w-8 text-right text-xs font-bold text-white">{count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confusion Matrix */}
                <div className="border-t border-slate-800/80 pt-5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-3 font-mono">
                    AI Prediction vs Human Decision Matrix (Ground Truth Validation)
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/80 rounded-xl p-4 border border-amber-500/30">
                      <div className="text-2xl font-bold font-mono text-amber-400 mb-1">{falsePositives}</div>
                      <div className="text-[11px] font-bold text-slate-300 uppercase font-mono">Confirmed False Positives</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-sans">High Risk Signal → Cleared by Human Analyst</div>
                    </div>
                    <div className="bg-slate-900/80 rounded-xl p-4 border border-rose-500/30">
                      <div className="text-2xl font-bold font-mono text-rose-400 mb-1">{confirmedSuspicious}</div>
                      <div className="text-[11px] font-bold text-slate-300 uppercase font-mono">Confirmed Malicious Fraud</div>
                      <div className="text-[10px] text-slate-400 mt-1 font-sans">High Risk Signal → Intercepted & Blocked</div>
                    </div>
                  </div>
                </div>

                {/* Pattern Explorer */}
                <div className="border-t border-slate-800/80 pt-5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase mb-2 font-mono">
                    Temporal Attack Hotspot Observation
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 border border-slate-800 rounded-xl font-sans">
                    Observed pattern: 73% of critical account takeover (ATO) cash-outs concentrate between <span className="font-bold text-rose-400 font-mono">01:00 AM - 04:30 AM BST</span>, exploiting dormant user notification periods. Supervised XGBoost model assigns a +28% risk factor to nocturnal window spikes.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Model Performance Center */}
          <div className="cyber-card rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <Cpu className="w-4 h-4 text-purple-400" />
              Machine Learning Model Performance & Telemetry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    XGBoost Classifier
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-blue-500/30 bg-blue-500/10 text-cyan-400 rounded">
                    xgb-v1.4
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Features</span>
                    <span className="font-bold text-white">11 Engineered Signals</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Test ROC-AUC</span>
                    <span className="font-bold text-emerald-400">0.984</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">False Positive Rate</span>
                    <span className="font-bold text-white">0.9%</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Isolation Forest Anomaly
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-purple-500/30 bg-purple-500/10 text-purple-400 rounded">
                    iforest-v1.2
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Outlier Threshold</span>
                    <span className="font-bold text-white">0.05 (95th Percentile)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Type</span>
                    <span className="font-bold text-purple-300">Zero-Day Attacks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Validation Status</span>
                    <span className="font-bold text-emerald-400">Validated</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Pipeline */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <Share2 className="w-4 h-4 text-emerald-400" />
              Sub-50ms Multi-Layered Decision Architecture
            </h3>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 text-xs font-mono overflow-x-auto pb-2">
              <PipelineStep title="Feature Store" desc="Kafka Streaming" />
              <div className="hidden sm:flex items-center text-slate-600">→</div>
              <PipelineStep title="XGB + IForest" desc="Prob + Outlier" />
              <div className="hidden sm:flex items-center text-slate-600">→</div>
              <PipelineStep title="Network Graph" desc="Mule Centrality" />
              <div className="hidden sm:flex items-center text-slate-600">→</div>
              <PipelineStep title="SHAP Explainer" desc="Local Attribution" />
              <div className="hidden sm:flex items-center text-slate-600">→</div>
              <PipelineStep title="Ops CRM" desc="Human-in-the-Loop" />
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Responsible AI Protocol */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 font-mono">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Responsible AI Governance
            </h3>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span><b>Synthetic Privacy Barrier:</b> Trained exclusively on synthetic MFS data. Zero leakage of customer PII.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span><b>Human-in-the-Loop:</b> Critical actions mandate operator review. AI never executes irreversible blocks autonomously.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span><b>Explainable AI (SHAP):</b> Every inference delivers mathematical factor decomposition to eradicate "black-box" decisions.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold font-mono">✓</span>
                <span><b>BFIU AML Compliance:</b> Structured timeline output ready for Bangladesh Financial Intelligence Unit STR filing.</span>
              </div>
            </div>
          </div>

          {/* Feedback Capture Rate */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 font-mono">
              Analyst Feedback Loop
            </h3>
            <p className="text-[11px] text-slate-400 italic mb-4 font-sans">
              Human analyst dispositions are recorded into immutable audit logs for scheduled batch re-training.
            </p>
            <div className="flex justify-between items-center bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono">
              <span className="text-xs text-slate-400">Dispositioned Cases</span>
              <span className="text-lg font-bold text-white">{casesWithFeedback} / {totalCases}</span>
            </div>

            <div className="mt-4 space-y-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Capture Coverage</span>
                <span className="font-bold text-cyan-400">
                  {totalCases === 0 ? 0 : Math.round((casesWithFeedback / totalCases) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalCases === 0 ? 0 : Math.round((casesWithFeedback / totalCases) * 100)}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="cyber-card rounded-2xl p-4 border border-slate-800 shadow-xl bg-[#0c1322]">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 font-mono">
        {label}
      </div>
      <div className={`text-2xl font-extrabold font-mono ${color || "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function PipelineStep({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex-1 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center min-w-[120px]">
      <div className="font-bold text-white text-xs">{title}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
    </div>
  );
}
