import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Cpu, Activity, Zap, Play, Pause, RefreshCw } from 'lucide-react';
import { LoomThreadInfo } from '../../engine/types';

export const LoomThreadModal: React.FC = () => {
  const { activeModal, closeModal } = useAuth();
  const [isRunning, setIsRunning] = useState(true);

  // Simulated Java 21 Loom Virtual Thread Pool State
  const [threads, setThreads] = useState<LoomThreadInfo[]>([
    { threadId: 1001, name: 'VirtualThread-1001#LoomCarrier-1', state: 'RUNNING', taskName: 'PerchanceAstEvaluator.compile()', cpuOverheadMs: 1.2, stackDepth: 14, memoryAllocatedKb: 28, timestamp: new Date().toISOString() },
    { threadId: 1002, name: 'VirtualThread-1002#LoomCarrier-1', state: 'CARRIER_MOUNTED', taskName: 'MonadicResultBridge.freeze()', cpuOverheadMs: 0.8, stackDepth: 8, memoryAllocatedKb: 18, timestamp: new Date().toISOString() },
    { threadId: 1003, name: 'VirtualThread-1003#LoomCarrier-2', state: 'WAITING', taskName: 'OllamaVisionGateway.awaitFrame()', cpuOverheadMs: 0.1, stackDepth: 4, memoryAllocatedKb: 12, timestamp: new Date().toISOString() },
    { threadId: 1004, name: 'VirtualThread-1004#LoomCarrier-2', state: 'RUNNING', taskName: 'ObsidianVaultParser.loadRules()', cpuOverheadMs: 2.1, stackDepth: 19, memoryAllocatedKb: 42, timestamp: new Date().toISOString() },
    { threadId: 1005, name: 'VirtualThread-1005#LoomCarrier-3', state: 'CARRIER_MOUNTED', taskName: 'ZeroTrustPolicyEngine.check()', cpuOverheadMs: 0.5, stackDepth: 6, memoryAllocatedKb: 16, timestamp: new Date().toISOString() },
  ]);

  if (activeModal !== 'loom') return null;

  const handleRefresh = () => {
    setThreads((prev) =>
      prev.map((t) => ({
        ...t,
        cpuOverheadMs: Number((Math.random() * 2.5 + 0.2).toFixed(1)),
        memoryAllocatedKb: Math.floor(Math.random() * 30 + 15),
        timestamp: new Date().toISOString(),
      }))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Java 21 Project Loom Virtual Thread Telemetry
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  JVM VTHREADS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Lightweight carrier thread scheduling, stack frame memory, and task allocations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                isRunning
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                  : 'border-slate-700 bg-slate-800 text-slate-300'
              }`}
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRunning ? 'Scheduler Active' : 'Paused'}</span>
            </button>
            <button onClick={handleRefresh} className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white cursor-pointer">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[75vh] bg-[#0b0f17]">
          {/* Overview Cards */}
          <div className="grid grid-cols-3 gap-4 font-mono">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[10px] uppercase text-slate-500 block">Total Active Virtual Threads</span>
              <span className="text-xl font-bold text-sky-400">128 Threads</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[10px] uppercase text-slate-500 block">Carrier Thread Pools</span>
              <span className="text-xl font-bold text-purple-400">4 Worker Cores</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="text-[10px] uppercase text-slate-500 block">Contention Delay</span>
              <span className="text-xl font-bold text-emerald-400">0.04 ms</span>
            </div>
          </div>

          {/* Thread Allocation Table */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/40">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2.5">Thread Identifier</th>
                  <th className="px-4 py-2.5">State</th>
                  <th className="px-4 py-2.5">Active Task Method</th>
                  <th className="px-4 py-2.5">CPU (ms)</th>
                  <th className="px-4 py-2.5">Mem (KB)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {threads.map((t) => (
                  <tr key={t.threadId} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-bold text-white">{t.name}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          t.state === 'RUNNING'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : t.state === 'CARRIER_MOUNTED'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {t.state}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-300">{t.taskName}</td>
                    <td className="px-4 py-2.5 text-sky-400">{t.cpuOverheadMs} ms</td>
                    <td className="px-4 py-2.5 text-slate-400">{t.memoryAllocatedKb} KB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
