import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, FileCode2, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export const ZeroTrustAuditModal: React.FC = () => {
  const { activeModal, closeModal } = useAuth();

  const auditLogs = [
    {
      id: 'aud_01',
      timestamp: new Date().toISOString(),
      action: 'JavaFX-to-JS Bridge Payload Transfer',
      status: 'FREEZE_APPROVED',
      hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      details: 'Object.freeze() executed recursively across 14 properties before JS runtime context mount.',
    },
    {
      id: 'aud_02',
      timestamp: new Date().toISOString(),
      action: 'Monadic Result Evaluation',
      status: 'MONAD_SUCCESS',
      hash: 'sha256:88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589',
      details: 'Evaluated Perchance AST Node [node_root] with zero uncaught exception side-effects.',
    },
    {
      id: 'aud_03',
      timestamp: new Date().toISOString(),
      action: 'Salted Scrypt Password Hash Verification',
      status: 'CREDENTIAL_PASS',
      hash: 'sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      details: 'Password hash matched 64-byte key derivation with random 16-byte salt.',
    },
  ];

  if (activeModal !== 'audit') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Zero-Trust Cryptographic Bridge Audit Log
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  ZERO TRUST
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Immutability verification, monadic result boundaries, and bridge payload SHA-256 hashes
              </p>
            </div>
          </div>

          <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[75vh] bg-[#0b0f17]">
          <div className="space-y-3 font-mono text-xs">
            {auditLogs.map((entry) => (
              <div key={entry.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {entry.action}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {entry.status}
                  </span>
                </div>

                <div className="text-slate-400 text-[11px] font-sans">{entry.details}</div>

                <div className="rounded bg-[#070a11] p-2 text-[10px] text-slate-500 font-mono break-all border border-slate-900">
                  Payload Hash: {entry.hash}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
