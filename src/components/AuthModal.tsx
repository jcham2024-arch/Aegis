import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, KeyRound, CheckCircle2, UserCheck } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { user, activeModal, authTab, closeModal, login, register, logout, showToast, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'profile' | 'password'>(
    authTab === 'password-reset' ? 'password' : (authTab as any) || 'login'
  );

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'user' | 'engineer' | 'admin'>('user');

  // Password Change & Reset States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (activeModal !== 'auth') return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(email, password, name, role);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const res = await api.changePassword(currentPassword, newPassword);
      setSuccessMessage(res.message);
      setCurrentPassword('');
      setNewPassword('');
      showToast('Password updated successfully.', 'success');
    } catch (err: any) {
      setError(err.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const res = await api.requestPasswordReset(resetEmail);
      setSuccessMessage(res.message);
      if (res.demoResetToken) {
        setGeneratedToken(res.demoResetToken);
        setResetToken(res.demoResetToken);
      }
      showToast('Password reset token generated.', 'info');
    } catch (err: any) {
      setError(err.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      const res = await api.confirmPasswordReset(resetToken, newPassword);
      setSuccessMessage(res.message);
      setResetToken('');
      setNewPassword('');
      showToast('Password reset confirmed. You may now log in.', 'success');
    } catch (err: any) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await api.updateProfile(profileName, profileBio);
      await refreshUser();
      setSuccessMessage('Profile information updated successfully.');
      showToast('Profile updated.', 'success');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Autofill
  const fillDemoAccount = (demoType: 'admin' | 'engineer' | 'user') => {
    if (demoType === 'admin') {
      setEmail('admin@aegis.local');
      setPassword('AdminPass123!');
    } else if (demoType === 'engineer') {
      setEmail('engineer@aegis.local');
      setPassword('Engineer123!');
    } else {
      setEmail('user@aegis.local');
      setPassword('UserPass123!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-[#0f172a] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-sky-400" />
            <h2 className="text-base font-semibold text-white">Identity & Access Control</h2>
          </div>
          <button
            onClick={closeModal}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 px-6 pt-3 gap-4 text-xs font-medium">
          {!user ? (
            <>
              <button
                onClick={() => { setActiveTab('login'); setError(null); }}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'login' ? 'border-sky-500 text-sky-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Log In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'register' ? 'border-sky-500 text-sky-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={() => { setActiveTab('profile'); setError(null); }}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'profile' ? 'border-sky-500 text-sky-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              My Profile
            </button>
          )}

          <button
            onClick={() => { setActiveTab('password'); setError(null); }}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'password' ? 'border-sky-500 text-sky-400 font-semibold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Password Management
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-300">
              <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && !user && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@aegis.local"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Demo Accounts Shortcut Strip */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <span className="block text-[11px] font-medium text-slate-400 mb-2">1-Click Demo Seed Accounts:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin')}
                    className="px-2 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-[11px] font-medium transition-colors cursor-pointer text-left"
                  >
                    <span className="block font-bold">Admin</span>
                    <span className="text-[9px] text-amber-400/80">admin@aegis.local</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('engineer')}
                    className="px-2 py-1.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 text-[11px] font-medium transition-colors cursor-pointer text-left"
                  >
                    <span className="block font-bold">Engineer</span>
                    <span className="text-[9px] text-sky-400/80">engineer@aegis.local</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('user')}
                    className="px-2 py-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-[11px] font-medium transition-colors cursor-pointer text-left"
                  >
                    <span className="block font-bold">Operator</span>
                    <span className="text-[9px] text-emerald-400/80">user@aegis.local</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && !user && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Secured using salted Scrypt hashing with 64-byte key derivation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">System Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                >
                  <option value="user">User Operator (General AI Agent Execution)</option>
                  <option value="engineer">AST Engineer (Perchance Compiler & Rule Builder)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && user && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 text-lg font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{user.name}</h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] text-slate-500 font-mono">
                    Account ID: {user.id}
                  </span>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Responsibilities</label>
                  <textarea
                    rows={2}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={logout}
                    className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-semibold text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PASSWORD MANAGEMENT */}
          {activeTab === 'password' && (
            <div className="space-y-6">
              {/* If user logged in: Change Password */}
              {user ? (
                <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Change Password
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              ) : (
                /* If logged out: Password Reset Flow */
                <div className="space-y-6">
                  {/* Step 1: Request Reset Token */}
                  <form onSubmit={handleResetRequestSubmit} className="space-y-4">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Step 1: Request Reset Token
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Account Email</label>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="admin@aegis.local"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-slate-800 border border-slate-700 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Request Reset Token
                    </button>
                  </form>

                  {generatedToken && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                      <span className="block font-semibold text-amber-300 mb-1">Generated Reset Token:</span>
                      <code className="block font-mono text-[11px] text-amber-200 break-all select-all">
                        {generatedToken}
                      </code>
                    </div>
                  )}

                  {/* Step 2: Confirm Reset */}
                  <form onSubmit={handleResetConfirmSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Step 2: Set New Password
                    </h3>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Reset Token</label>
                      <input
                        type="text"
                        required
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Paste reset token here"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 px-3 text-xs text-white focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-sky-600 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {loading ? 'Resetting Password...' : 'Confirm Reset Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
