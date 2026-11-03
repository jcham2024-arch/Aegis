import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { IdeWorkspace } from './components/IdeWorkspace';
import { AuthModal } from './components/AuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LoomThreadModal } from './components/overlays/LoomThreadModal';
import { VaultIngestModal } from './components/overlays/VaultIngestModal';
import { VisionCaptureModal } from './components/overlays/VisionCaptureModal';
import { ZeroTrustAuditModal } from './components/overlays/ZeroTrustAuditModal';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toastMessage } = useAuth();
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-md text-xs font-medium text-white">
      {toastMessage.type === 'success' ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
      ) : toastMessage.type === 'error' ? (
        <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
      ) : (
        <Info className="h-4 w-4 text-sky-400 shrink-0" />
      )}
      <span>{toastMessage.text}</span>
    </div>
  );
};

export function AppContent() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0f17] text-slate-100">
      <Navbar />
      <IdeWorkspace />

      {/* System Modals & Overlays */}
      <AuthModal />
      <AdminDashboardModal />
      <LoomThreadModal />
      <VaultIngestModal />
      <VisionCaptureModal />
      <ZeroTrustAuditModal />

      {/* Toast Notification Handler */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
