"use client";

import React, { useState } from "react";
import { TransactionInput } from "@/lib/types";
import { Network, ShieldAlert, CheckCircle2, AlertTriangle, Layers, Info, Radio } from "lucide-react";

interface NodeDetail {
  id: string;
  label: string;
  role: "SENDER" | "MULE_HOP" | "RECEIVER" | "AGENT";
  status: "SAFE" | "SUSPICIOUS" | "CRITICAL";
  riskScore: number;
  location: string;
  txVolume: string;
}

export default function NetworkGraph({ tx }: { tx: TransactionInput }) {
  const isMuleNetwork = (tx.transactionVelocity ?? 0) > 10 && tx.receiverIsNew && tx.isNewDevice;
  const isSuspiciousRoute = tx.receiverIsNew || tx.isUnusualLocation || tx.amount > 20000;

  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Dynamic nodes based on simulation
  const nodes: NodeDetail[] = [
    {
      id: "sender",
      label: tx.senderAccount,
      role: "SENDER",
      status: "SAFE",
      riskScore: 12,
      location: tx.isUnusualLocation ? "Unverified IP (Chattogram)" : "Dhaka, BD (Verified)",
      txVolume: `৳${tx.amount.toLocaleString()}`
    },
    ...(isMuleNetwork
      ? [
          {
            id: "hop1",
            label: "AC••••1142",
            role: "MULE_HOP" as const,
            status: "CRITICAL" as const,
            riskScore: 91,
            location: "Gazipur MFS Hub",
            txVolume: "৳45,000 (Rapid Hop)"
          },
          {
            id: "hop2",
            label: "AC••••7720",
            role: "MULE_HOP" as const,
            status: "CRITICAL" as const,
            riskScore: 88,
            location: "Narayanganj Terminal",
            txVolume: "৳42,000 (Funneled)"
          }
        ]
      : isSuspiciousRoute
      ? [
          {
            id: "hop1",
            label: "Unverified Hop",
            role: "MULE_HOP" as const,
            status: "SUSPICIOUS" as const,
            riskScore: 58,
            location: "Unknown Geocell",
            txVolume: "First-time Handshake"
          }
        ]
      : []),
    {
      id: "receiver",
      label: tx.receiverAccount,
      role: tx.type === "CASH_OUT" ? "AGENT" : "RECEIVER",
      status: isMuleNetwork ? "CRITICAL" : isSuspiciousRoute ? "SUSPICIOUS" : "SAFE",
      riskScore: isMuleNetwork ? 94 : isSuspiciousRoute ? 62 : 8,
      location: tx.receiverIsNew ? "Newly Linked Outlet" : "Registered Partner",
      txVolume: `Destination Node`
    }
  ];

  const activeNodeData = nodes.find(n => n.id === selectedNode) || nodes[nodes.length - 1];

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-full bg-[#0c1322]">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
              Topological Graph Intelligence
            </h3>
            <p className="text-[11px] text-slate-400">Multi-Hop Mule Ring & Counterparty Analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border flex items-center gap-1 ${
            isMuleNetwork 
              ? "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse" 
              : isSuspiciousRoute 
              ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          }`}>
            <Radio className="w-2.5 h-2.5" />
            {isMuleNetwork ? "MULE RING DETECTED" : isSuspiciousRoute ? "SUSPICIOUS ROUTE" : "TRUSTED TOPOLOGY"}
          </span>
        </div>
      </div>

      {/* Interactive Graph Canvas Area */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between relative bg-gradient-to-b from-[#0c1322] to-[#080d18]">
        
        {/* SVG Flow Canvas */}
        <div className="relative py-6 px-2 flex items-center justify-between w-full min-h-[170px]">
          
          {/* Animated SVG Connector Line */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-full h-16" preserveAspectRatio="none" viewBox="0 0 400 40">
              <defs>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor={isMuleNetwork ? "#ef4444" : "#818cf8"} />
                  <stop offset="100%" stopColor={isMuleNetwork ? "#dc2626" : "#10b981"} />
                </linearGradient>
              </defs>
              <path 
                d="M 40 20 L 360 20" 
                stroke="url(#flowGrad)" 
                strokeWidth="2.5" 
                strokeDasharray={isMuleNetwork ? "6 4" : "8 5"}
                className={isMuleNetwork ? "animate-pulse" : ""}
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const isSelected = selectedNode === node.id || (!selectedNode && node.id === "receiver");
            const isRed = node.status === "CRITICAL";
            const isAmber = node.status === "SUSPICIOUS";
            const isGreen = node.status === "SAFE";

            return (
              <div 
                key={node.id} 
                onClick={() => setSelectedNode(node.id)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                {/* Node Halo & Circle */}
                <div className={`relative p-3 rounded-2xl border transition-all duration-300 transform group-hover:scale-110 ${
                  isSelected ? "scale-105 shadow-xl" : "hover:scale-100"
                } ${
                  isRed 
                    ? "bg-red-950/80 border-red-500 text-red-300 shadow-red-900/50" 
                    : isAmber
                    ? "bg-amber-950/80 border-amber-500 text-amber-300 shadow-amber-900/50"
                    : "bg-slate-900/90 border-cyan-500/50 text-cyan-300 shadow-cyan-900/30"
                }`}>
                  {isRed ? (
                    <ShieldAlert className="w-5 h-5 text-red-400 animate-bounce" />
                  ) : isAmber ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}

                  {/* Tiny status indicator */}
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0c1322] ${
                    isRed ? "bg-red-500 animate-ping" : isAmber ? "bg-amber-400" : "bg-emerald-400"
                  }`} />
                </div>

                {/* Node Label */}
                <div className="mt-2 text-center">
                  <div className={`text-xs font-mono font-bold tracking-tight ${
                    isRed ? "text-red-400" : isAmber ? "text-amber-300" : "text-slate-200"
                  }`}>
                    {node.label}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">
                    {node.role.replace("_", " ")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Box */}
        <div className="mt-4 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5 font-mono">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Node Detail: {activeNodeData.label}
            </span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
              activeNodeData.status === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
              activeNodeData.status === "SUSPICIOUS" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
              "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
              Risk: {activeNodeData.riskScore}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400">Topology Role:</span>{" "}
              <span className="font-semibold text-slate-200">{activeNodeData.role}</span>
            </div>
            <div>
              <span className="text-slate-400">Location/Cell:</span>{" "}
              <span className="font-semibold text-slate-200 truncate">{activeNodeData.location}</span>
            </div>
            <div>
              <span className="text-slate-400">Flow Volume:</span>{" "}
              <span className="font-semibold text-slate-200">{activeNodeData.txVolume}</span>
            </div>
            <div>
              <span className="text-slate-400">Graph Clustering:</span>{" "}
              <span className="font-semibold text-cyan-400">{isMuleNetwork ? "0.92 (High Density)" : "0.08 (Benign)"}</span>
            </div>
          </div>
        </div>

        {/* Bottom Context Footnote */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-500" /> Click any node to inspect graph metadata
          </span>
          <span className="font-mono text-slate-400">
            {isMuleNetwork ? "3-Hop Layering Attack" : "Direct P2P Link"}
          </span>
        </div>

      </div>
    </div>
  );
}
