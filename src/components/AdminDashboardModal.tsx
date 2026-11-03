import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserProfile, SystemMetrics, SystemLogEntry, AppConfigSettings } from '../engine/types';
import {
  X,
  Users,
  Cpu,
  Terminal,
  Settings,
  ShieldCheck,
  UserCheck,
  UserX,
  KeyRound,
  RefreshCw,
  Search,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';

export const AdminDashboardModal: React.FC = () => {
  const { user, activeModal, closeModal, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'metrics' | 'logs' | 'config'>('users');

  // Data States
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [config, setConfig] = useState<AppConfigSettings | null>(null);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [logFilter, setLogFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'security'>('all');

  // Selected User Edit State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState<'admin' | 'engineer' | 'auditor' | 'user'>('user');
  const [editStatus, setEditStatus] = useState<'active' | 'disabled'>('active');
  const [overridePassword, setOverridePassword] = useState('');

  if (activeModal !== 'admin' || !user || user.role !== 'admin') {
    return null;
  }

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const u = await api.getAdminUsers();
        setUsersList(u);
      } else if (activeTab === 'metrics') {
        const m = await api.getSystemMetrics();
        setMetrics(m);
      } else if (activeTab === 'logs') {
        const l = await api.getSystemLogs();
        setLogs(l);
      } else if (activeTab === 'config') {
        const c = await api.getSystemConfig();
        setConfig(c);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch admin data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  // User Actions
  const handleToggleUserStatus = async (targetUser: UserProfile) => {
    const newStatus = targetUser.status === 'active' ? 'disabled' : 'active';
    try {
      const updated = await api.updateAdminUser(targetUser.id, { status: newStatus });
      setUsersList(usersList.map((u) => (u.id === updated.id ? updated : u)));
      showToast(`User ${updated.email} status set to ${newStatus.toUpperCase()}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status.', 'error');
    }
  };

  const handleSaveUserEdits = async () => {
    if (!editingUser) return;
    try {
      const updated = await api.updateAdminUser(editingUser.id, { role: editRole, status: editStatus });
      setUsersList(usersList.map((u) => (u.id === updated.id ? updated : u)));
      if (overridePassword && overridePassword.length >= 8) {
        await api.resetUserPasswordOverride(editingUser.id, overridePassword);
        showToast(`Password override applied for ${editingUser.email}`, 'info');
      }
      showToast(`User ${updated.email} updated successfully.`, 'success');
      setEditingUser(null);
      setOverridePassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to save user updates.', 'error');
    }
  };

  // Config Actions
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    try {
      const updated = await api.updateSystemConfig(config);
      setConfig(updated);
      showToast('System configuration saved successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save configuration.', 'error');
    }
  };

  const filteredUsers = usersList.filter(
    (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLogs = logs.filter((l) => logFilter === 'all' || l.level === logFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl h-[85vh] rounded-2xl border border-slate-800 bg-[#0f172a] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Administrative Control Console
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  RBAC ADMIN
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                User Access Control, Loom Virtual Thread Telemetry, Error Logs & Global Policy Configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Top Navigation Bar */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-6 gap-6 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'users' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'metrics' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-4 w-4" />
            <span>System Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'logs' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Audit & Error Logs</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'config' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>App Configuration</span>
          </button>
        </div>

        {/* Tab Body Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0b0f17]">
          {/* TAB 1: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name or email..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Total Registered Accounts: <span className="text-amber-400 font-bold">{usersList.length}</span>
                </div>
              </div>

              {/* Users Data Grid Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">User / Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-white font-sans">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              u.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : u.role === 'engineer'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                              u.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingUser(u);
                                setEditRole(u.role);
                                setEditStatus(u.status);
                              }}
                              className="px-2.5 py-1 rounded border border-slate-700 bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 text-[11px] font-sans transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className={`p-1 rounded border transition-colors cursor-pointer ${
                                u.status === 'active'
                                  ? 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                  : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                              title={u.status === 'active' ? 'Disable Account' : 'Enable Account'}
                            >
                              {u.status === 'active' ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Edit User Drawer / Sub-Modal */}
              {editingUser && (
                <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 p-4 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Editing User: {editingUser.email}
                    </h3>
                    <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Assign Role</label>
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 px-3 text-xs text-white"
                      >
                        <option value="admin">Administrator (Full Access)</option>
                        <option value="engineer">AST Engineer (Rule Builder)</option>
                        <option value="auditor">Auditor (Read-Only Logs)</option>
                        <option value="user">User Operator (Standard)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Account Status</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 px-3 text-xs text-white"
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled (Blocked from API)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Admin Password Override</label>
                      <input
                        type="password"
                        value={overridePassword}
                        onChange={(e) => setOverridePassword(e.target.value)}
                        placeholder="New password (optional)"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 py-1.5 px-3 text-xs text-white placeholder-slate-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingUser(null)}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveUserEdits}
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Apply Account Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SYSTEM TELEMETRY */}
          {activeTab === 'metrics' && metrics && (
            <div className="space-y-6">
              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Loom Virtual Threads</span>
                    <Cpu className="h-4 w-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.activeVirtualThreads}</div>
                  <span className="text-[10px] text-slate-500 font-mono">Carrier Threads Active</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Heap Memory Used</span>
                    <Activity className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.memoryUsageMb.heapUsed} MB</div>
                  <span className="text-[10px] text-slate-500 font-mono">of {metrics.memoryUsageMb.heapTotal} MB total</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>LLM Requests Total</span>
                    <Server className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.llmRequestsTotal}</div>
                  <span className="text-[10px] text-emerald-400 font-mono">{metrics.llmSuccessCount} Success / {metrics.llmErrorCount} Error</span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>System Uptime</span>
                    <Activity className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{metrics.uptimeSeconds}s</div>
                  <span className="text-[10px] text-slate-500 font-mono">Process Runtime</span>
                </div>
              </div>

              {/* Memory Allocation Breakdown */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  JVM & Node Heap Memory Visualizer
                </h3>
                <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    style={{ width: `${(metrics.memoryUsageMb.heapUsed / metrics.memoryUsageMb.rss) * 100}%` }}
                    className="bg-sky-500 h-full transition-all duration-500"
                    title="Heap Used"
                  />
                  <div
                    style={{
                      width: `${
                        ((metrics.memoryUsageMb.heapTotal - metrics.memoryUsageMb.heapUsed) / metrics.memoryUsageMb.rss) * 100
                      }%`,
                    }}
                    className="bg-sky-800 h-full transition-all duration-500"
                    title="Heap Total Reserved"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Heap Used: {metrics.memoryUsageMb.heapUsed} MB</span>
                  <span>Heap Allocated: {metrics.memoryUsageMb.heapTotal} MB</span>
                  <span>RSS Total: {metrics.memoryUsageMb.rss} MB</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT & ERROR LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Filter Log Level:</span>
                  {(['all', 'info', 'warn', 'error', 'security'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase cursor-pointer transition-colors ${
                        logFilter === lvl
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-slate-500 font-mono">{filteredLogs.length} entries shown</div>
              </div>

              {/* Log Stream Terminal Container */}
              <div className="rounded-xl border border-slate-800 bg-[#070a11] p-4 font-mono text-xs max-h-[50vh] overflow-y-auto space-y-2">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 border-b border-slate-900/80 pb-2">
                    <span className="text-slate-500 text-[10px] whitespace-nowrap shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded shrink-0 ${
                        log.level === 'security'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : log.level === 'error'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : log.level === 'warn'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-400 font-semibold shrink-0">[{log.module}]</span>
                    <span className="text-slate-200 flex-1">{log.message}</span>
                    {log.userEmail && <span className="text-slate-500 text-[10px]">({log.userEmail})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APP CONFIGURATION */}
          {activeTab === 'config' && config && (
            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-3xl">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  AI Model Provider Routing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Default AI Provider</label>
                    <select
                      value={config.defaultProvider}
                      onChange={(e) => setConfig({ ...config, defaultProvider: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white"
                    >
                      <option value="gemini">Google Gemini Cloud API</option>
                      <option value="ollama">Local Ollama HTTP Daemon</option>
                      <option value="custom">Custom OpenAI-Compatible Proxy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Gemini Model Designation</label>
                    <input
                      type="text"
                      value={config.geminiModel}
                      onChange={(e) => setConfig({ ...config, geminiModel: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Local Ollama Base URL</label>
                    <input
                      type="text"
                      value={config.ollamaBaseUrl}
                      onChange={(e) => setConfig({ ...config, ollamaBaseUrl: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Zero-Trust Policy Level</label>
                    <select
                      value={config.zeroTrustPolicyLevel}
                      onChange={(e) => setConfig({ ...config, zeroTrustPolicyLevel: e.target.value as any })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-white"
                    >
                      <option value="strict">Strict (Deep-freeze all bridge objects, mandatory AST schema)</option>
                      <option value="moderate">Moderate (Standard validation)</option>
                      <option value="permissive">Permissive (Development testing mode)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Save App Configurations
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
