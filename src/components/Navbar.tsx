import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Cpu, FolderGit2, Eye, FileCode2, LayoutDashboard, User, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, openModal } = useAuth();

  return (
    <header className="h-14 border-b border-slate-800 bg-[#0f172a] px-4 flex items-center justify-between gap-8 shrink-0 z-20">
      {/* Zone 1: Single Text Element Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Shield className="h-4 w-4" />
        </div>
        <a href="/" className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0">
          Aegis-Agent
        </a>
      </div>

      {/* Zone 2: System Menu Navigation Links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => openModal('vault')}
          className="flex items-center gap-1.5 hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FolderGit2 className="h-3.5 w-3.5 text-slate-400" />
          <span>Vault Ingest</span>
        </button>

        <button
          onClick={() => openModal('loom')}
          className="flex items-center gap-1.5 hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Cpu className="h-3.5 w-3.5 text-slate-400" />
          <span>Loom Threads</span>
        </button>

        <button
          onClick={() => openModal('vision')}
          className="flex items-center gap-1.5 hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-slate-400" />
          <span>Vision Inspector</span>
        </button>

        <button
          onClick={() => openModal('audit')}
          className="flex items-center gap-1.5 hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <FileCode2 className="h-3.5 w-3.5 text-slate-400" />
          <span>Audit Stream</span>
        </button>

        {user && user.role === 'admin' && (
          <button
            onClick={() => openModal('admin')}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-semibold"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Admin Console</span>
          </button>
        )}
      </nav>

      {/* Zone 3: Primary Actions & User Auth */}
      <div className="flex items-center gap-3 shrink-0">
        {user ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('auth', 'profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-sky-400" />
              <span className="font-medium max-w-[120px] truncate">{user.name}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-700/50">
                {user.role}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('auth', 'login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => openModal('auth', 'register')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
