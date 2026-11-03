import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, FolderGit2, FileText, CheckCircle2, ShieldCheck, Upload } from 'lucide-react';
import { AgentRuleDagNode } from '../../engine/types';

export const VaultIngestModal: React.FC = () => {
  const { activeModal, closeModal, showToast } = useAuth();

  const [vaultNodes, setVaultNodes] = useState<AgentRuleDagNode[]>([
    {
      id: 'rule_01',
      title: 'Zero-Trust Payload Isolation Policy',
      type: 'policy',
      content: 'All objects transferred between Java Host and JavaScript WebEngine must pass deepFreeze() validation.',
      children: ['rule_02'],
      status: 'active',
    },
    {
      id: 'rule_02',
      title: 'Monadic Exception Containment',
      type: 'constraint',
      content: 'Fallible computations must be encapsulated in Result<S, F> containers with no raw uncaught exceptions.',
      children: ['rule_03'],
      status: 'active',
    },
    {
      id: 'rule_03',
      title: 'Multimodal Vision Privacy Bound',
      type: 'action',
      content: 'Screen frame captures must mask password inputs and PII fields before broadcasting to Ollama or Gemini API.',
      children: [],
      status: 'active',
    },
  ]);

  const [rawMarkdown, setRawMarkdown] = useState<string>(
    `# Obsidian Agent Rule Vault Ingestion\n\n- [[Zero-Trust Payload Isolation Policy]]\n- [[Monadic Exception Containment]]\n- [[Multimodal Vision Privacy Bound]]\n\nEnforcing strict sealed interface pattern matching across all Java 21 Loom virtual thread carriers.`
  );

  if (activeModal !== 'vault') return null;

  const handleIngestVault = () => {
    showToast('Obsidian Vault & .agentrules DAG graph ingested successfully.', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Obsidian Vault & .agentrules DAG Ingestion Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  DAG INGEST
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Load Markdown vault structures, link graph dependencies, and enforce agent rules
              </p>
            </div>
          </div>

          <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[75vh] bg-[#0b0f17]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Raw Vault Text */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-400" />
                Raw Obsidian Vault Markdown / .agentrules
              </label>
              <textarea
                rows={12}
                value={rawMarkdown}
                onChange={(e) => setRawMarkdown(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Parsed Rule Graph Nodes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Parsed DAG Policy Graphs ({vaultNodes.length} Nodes)
              </label>

              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {vaultNodes.map((node) => (
                  <div key={node.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        {node.title}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        {node.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{node.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer">
              Cancel
            </button>
            <button
              onClick={handleIngestVault}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Ingest & Synchronize Vault Rules</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
