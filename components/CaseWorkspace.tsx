"use client";

import React, { useState } from "react";
import { useCases } from "@/lib/casesStore";
import { ArrowLeft, Clock, ShieldCheck, AlertTriangle, ShieldAlert, FileText, Send, UserCheck, CheckCircle2, RotateCcw } from "lucide-react";
import XAIFactors from "./XAIFactors";
import NetworkGraph from "./NetworkGraph";
import BehaviorInsights from "./BehaviorInsights";

export default function CaseWorkspace({ caseId, onBack }: { caseId: string, onBack: () => void }) {
  const { cases, updateCase, addNote, addAuditEvent } = useCases();
  const caseData = cases.find(c => c.caseId === caseId);
  const [newNote, setNewNote] = useState("");

  if (!caseData) return <div className="text-slate-400 p-8">Case not found</div>;

  const { riskAssessment: riskOutput, transaction: tx } = caseData;

  const handleStatusChange = (status: any) => {
    updateCase(caseId, { status });
    addAuditEvent(caseId, `Status transitioned to ${status}`, "Analyst (You)");
  };

  const handleDispositionChange = (disposition: any) => {
    updateCase(caseId, { disposition, status: disposition ? "RESOLVED" : caseData.status });
    addAuditEvent(caseId, `Final Disposition recorded as ${disposition}`, "Analyst (You)");
  };

  const handleAssignment = (assignedTo: string) => {
    updateCase(caseId, { assignedTo });
    addAuditEvent(caseId, `Case reassigned to ${assignedTo}`, "Analyst (You)");
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNote(caseId, newNote, "Analyst (You)");
    addAuditEvent(caseId, "Analyst investigative note appended", "Analyst (You)");
    setNewNote("");
  };

  const isCritical = riskOutput.riskLevel === "CRITICAL";
  const isModerate = riskOutput.riskLevel === "MODERATE";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & Case Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-extrabold text-white tracking-tight font-mono">
                {caseData.caseId}
              </h2>
              <span className="px-2 py-0.5 bg-blue-500/10 text-cyan-400 text-[10px] font-mono font-bold tracking-wider rounded-md border border-blue-500/20 uppercase">
                {caseData.scenarioLabel || "Security Incident"}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              Customer Wallet: {tx.senderAccount} • Counterparty: {tx.receiverAccount}
            </div>
          </div>
        </div>

        {/* Risk Badge */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              AI Risk Index
            </div>
            <div className={`text-xl font-mono font-extrabold ${
              isCritical ? "text-rose-400" : isModerate ? "text-amber-400" : "text-emerald-400"
            }`}>
              {riskOutput.finalRiskScore}% • {riskOutput.riskLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Decision Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status */}
        <div className="cyber-card rounded-2xl p-4 border border-slate-800 bg-[#0c1322]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
            Workflow Status
          </label>
          <select
            value={caseData.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs font-mono font-bold text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="NEW">NEW</option>
            <option value="UNDER REVIEW">UNDER REVIEW</option>
            <option value="ESCALATED">ESCALATED</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>

        {/* Assigned Analyst */}
        <div className="cyber-card rounded-2xl p-4 border border-slate-800 bg-[#0c1322]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
            Assigned Investigator
          </label>
          <select
            value={caseData.assignedTo}
            onChange={(e) => handleAssignment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs font-mono font-bold text-slate-200 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="Fraud Operations L1">Fraud Operations L1</option>
            <option value="Senior Reviewer Farhan">Senior Reviewer Farhan</option>
            <option value="Analyst Nahid">Analyst Nahid</option>
            <option value="BFIU Compliance Desk">BFIU Compliance Desk</option>
          </select>
        </div>

        {/* Final Disposition */}
        <div className="cyber-card rounded-2xl p-4 border border-slate-800 bg-[#0c1322]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
            Final Human Disposition
          </label>
          <select
            value={caseData.disposition}
            onChange={(e) => handleDispositionChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2 text-xs font-mono font-bold text-amber-400 outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="">-- Pending Disposition --</option>
            <option value="CONFIRMED_SUSPICIOUS">CONFIRMED FRAUD (BLOCKED)</option>
            <option value="FALSE_POSITIVE">FALSE POSITIVE (CLEARED)</option>
            <option value="ESCALATED_L2">ESCALATE TO REGULATOR (BFIU)</option>
            <option value="NO_ACTION">NO ACTION REQUIRED</option>
          </select>
        </div>

        {/* Policy Recommendation */}
        <div className="cyber-card rounded-2xl p-4 border border-slate-800 bg-[#0c1322]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 font-mono">
            System Policy Recommendation
          </label>
          <div className="text-xs font-mono font-extrabold text-cyan-400 truncate mt-1">
            {riskOutput.recommendedAction.replace(/_/g, " ")}
          </div>
        </div>
      </div>

      {/* Main Grid: Visualizers on Left, Timeline & Notes on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (8 cols): Topography & Behavior Insights */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BehaviorInsights tx={tx} />
            <NetworkGraph tx={tx} />
          </div>

          {/* XAI Factors Card */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
              Forensic SHAP Impact Factors
            </h3>
            <XAIFactors factors={riskOutput.xaiFactors} />
          </div>
        </div>

        {/* Right (4 cols): Audit Trail & Analyst Notes */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Analyst Notes Box */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl bg-[#0c1322] flex flex-col h-[320px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5 text-cyan-400" /> Analyst Notes
              </h3>
              <span className="text-[10px] font-mono text-slate-500">{caseData.notes.length} entries</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {caseData.notes.length === 0 ? (
                <div className="text-xs text-slate-500 italic p-4 text-center">No notes recorded yet.</div>
              ) : (
                caseData.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                    <p className="text-slate-300 leading-relaxed font-sans">{note.text}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-800/60">
                      <span>{note.author}</span>
                      <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex gap-2">
              <input
                type="text"
                placeholder="Add case observation..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleAddNote}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Immutable Audit Log */}
          <div className="cyber-card rounded-2xl p-5 border border-slate-800 shadow-2xl bg-[#0c1322]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-purple-400" /> Immutable Audit Trail
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {caseData.auditEvents.map((evt) => (
                <div key={evt.id} className="flex items-start gap-2 text-[11px] text-slate-400">
                  <span className="text-cyan-400">●</span>
                  <div>
                    <span className="text-slate-200">{evt.action}</span>
                    <span className="text-slate-500 block text-[10px]">by {evt.actor} • {new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
