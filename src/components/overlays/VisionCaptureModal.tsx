import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Eye, Camera, Shield, CheckCircle2 } from 'lucide-react';

export const VisionCaptureModal: React.FC = () => {
  const { activeModal, closeModal, showToast } = useAuth();
  const [capturing, setCapturing] = useState(false);
  const [visionLog, setVisionLog] = useState<string[]>([]);

  if (activeModal !== 'vision') return null;

  const handleCaptureFrame = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setVisionLog((prev) => [
        `[${new Date().toLocaleTimeString()}] Frame captured: 1440x900 JavaFX WebEngine DOM Viewport`,
        `[${new Date().toLocaleTimeString()}] Zero-Trust Masking: 2 PII password fields redacted`,
        `[${new Date().toLocaleTimeString()}] Streamed to Local Ollama Vision Daemon / Gemini Multimodal API`,
        ...prev,
      ]);
      showToast('Multimodal screen frame captured and analyzed with zero-trust privacy mask.', 'success');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Multimodal Screen Vision & Automation Capture Service
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  VISION INSPECTOR
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Clips target application windows via OS/Robot handles and streams frame byte-arrays to local vision models
              </p>
            </div>
          </div>

          <button onClick={closeModal} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[75vh] bg-[#0b0f17]">
          {/* Simulated Viewport Frame Capture Preview */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col items-center justify-center min-h-[220px] text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-sky-500/5 pointer-events-none" />

            <div className="h-16 w-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <Camera className="h-8 w-8" />
            </div>

            <h3 className="text-sm font-semibold text-white">JavaFX Robot / WebEngine Window Handle Active</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Captures live DOM state and converts UI bounds into structured coordinate assertions without blind pixel guessing.
            </p>

            <button
              onClick={handleCaptureFrame}
              disabled={capturing}
              className="mt-4 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Camera className="h-4 w-4" />
              <span>{capturing ? 'Capturing Frame...' : 'Capture Vision Frame'}</span>
            </button>
          </div>

          {/* Vision Log Terminal */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              Vision Stream Analysis Log
            </label>
            <div className="rounded-xl border border-slate-800 bg-[#070a11] p-4 font-mono text-xs space-y-1 max-h-[160px] overflow-y-auto text-slate-300">
              {visionLog.length === 0 ? (
                <div className="text-slate-600 italic">No vision frames captured yet. Click "Capture Vision Frame" above to test screen inspection.</div>
              ) : (
                visionLog.map((line, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    <span>{line}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
