"use client";

import React, { useState } from "react";
import { useCases } from "@/lib/casesStore";
import CaseWorkspace from "./CaseWorkspace";
import { Search, Filter, AlertTriangle, ShieldCheck, Activity, Users, ArrowUpRight, RotateCcw } from "lucide-react";

export default function OperationsQueue() {
  const { cases, resetToDefaults } = useCases();
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  if (selectedCaseId) {
    return <CaseWorkspace caseId={selectedCaseId} onBack={() => setSelectedCaseId(null)} />;
  }

  // Analytics derived from current CRM state
  const openCases = cases.filter(c => c.status !== "RESOLVED").length;
  const criticalCases = cases.filter(c => c.status !== "RESOLVED" && c.riskAssessment?.riskLevel === "CRITICAL").length;
  const underReviewCases = cases.filter(c => c.status === "UNDER REVIEW").length;
  const escalatedCases = cases.filter(c => c.status === "ESCALATED").length;

  const filteredCases = cases.filter(c => {
    if (filterStatus !== "ALL" && c.status !== filterStatus) return false;
    if (filterRisk !== "ALL" && c.riskAssessment?.riskLevel !== filterRisk) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !c.caseId.toLowerCase().includes(q) &&
        !c.transaction.senderAccount.toLowerCase().includes(q) &&
        !(c.scenarioLabel || "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Risk Operations & Case Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Human-in-the-Loop CRM for fraud analysts to review, challenge, and resolve AI-escalated threats
          </p>
        </div>

        <button
          onClick={resetToDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 transition cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Cases</span>
        </button>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="cyber-card rounded-2xl p-4 border border-slate-800 shadow-xl bg-[#0c1322]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" /> Active Workflow
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{openCases}</div>
          <div className="text-[10px] text-slate-500 mt-1">Pending resolution</div>
        </div>

        <div className="cyber-card rounded-2xl p-4 border border-slate-800 shadow-xl bg-[#0c1322]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-rose-500" /> Critical Review
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{criticalCases}</div>
          <div className="text-[10px] text-slate-500 mt-1">Requires urgent block</div>
        </div>

        <div className="cyber-card rounded-2xl p-4 border border-slate-800 shadow-xl bg-[#0c1322]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-amber-500" /> Under Review
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{underReviewCases}</div>
          <div className="text-[10px] text-slate-500 mt-1">L1 Analyst investigating</div>
        </div>

        <div className="cyber-card rounded-2xl p-4 border border-slate-800 shadow-xl bg-[#0c1322]">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
            <Users className="w-3 h-3 text-purple-400" /> Escalated to L2
          </div>
          <div className="text-2xl font-extrabold text-purple-400 font-mono">{escalatedCases}</div>
          <div className="text-[10px] text-slate-500 mt-1">BFIU / Regulatory referral</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card rounded-2xl p-4 border border-slate-800 shadow-xl bg-[#0c1322] flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case ID, Wallet, or Scenario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-mono font-bold text-slate-300 p-2 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="UNDER REVIEW">UNDER REVIEW</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-mono font-bold text-slate-300 p-2 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="MODERATE">MODERATE</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Case Management Table */}
      <div className="cyber-card border border-slate-800 shadow-2xl rounded-2xl overflow-hidden bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="p-4 whitespace-nowrap">Case ID</th>
                <th className="p-4 whitespace-nowrap">Wallet & Route</th>
                <th className="p-4 whitespace-nowrap">Amount / Type</th>
                <th className="p-4 whitespace-nowrap">AI Risk Score</th>
                <th className="p-4 whitespace-nowrap">Threat Scenario</th>
                <th className="p-4 whitespace-nowrap">Assigned Analyst</th>
                <th className="p-4 whitespace-nowrap">Status</th>
                <th className="p-4 whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                    No cases found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                  const riskLevel = c.riskAssessment?.riskLevel || "LOW";
                  const score = c.riskAssessment?.finalRiskScore ?? 0;
                  const isCritical = riskLevel === "CRITICAL";
                  const isModerate = riskLevel === "MODERATE";

                  return (
                    <tr 
                      key={c.caseId} 
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                      onClick={() => setSelectedCaseId(c.caseId)}
                    >
                      {/* Case ID */}
                      <td className="p-4 font-bold text-cyan-400 whitespace-nowrap">
                        {c.caseId}
                      </td>

                      {/* Wallet */}
                      <td className="p-4 text-slate-300 whitespace-nowrap">
                        <div>{c.transaction.senderAccount}</div>
                        <div className="text-[10px] text-slate-500">→ {c.transaction.receiverAccount}</div>
                      </td>

                      {/* Amount / Type */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-white">৳{c.transaction.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-400 font-sans">{c.transaction.type.replace("_", " ")}</div>
                      </td>

                      {/* Risk Score */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isCritical
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : isModerate
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isCritical ? "bg-rose-400 animate-ping" : isModerate ? "bg-amber-400" : "bg-emerald-400"
                          }`} />
                          {score}% • {riskLevel}
                        </span>
                      </td>

                      {/* Threat Scenario */}
                      <td className="p-4 text-slate-300 font-sans whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                          {c.scenarioLabel || "Anomaly Detected"}
                        </span>
                      </td>

                      {/* Assigned Analyst */}
                      <td className="p-4 text-slate-400 font-sans whitespace-nowrap text-xs">
                        {c.assignedTo || "Unassigned"}
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide border ${
                          c.status === "RESOLVED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : c.status === "ESCALATED"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : c.status === "UNDER REVIEW"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        }`}>
                          {c.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCaseId(c.caseId);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg border border-blue-500/30 transition-all font-sans text-xs font-semibold cursor-pointer"
                        >
                          <span>Investigate</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
