import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../engine/types';
import { api, getStoredToken, removeStoredToken } from '../services/api';

export type ModalType = 'none' | 'auth' | 'admin' | 'loom' | 'vault' | 'vision' | 'audit';
export type AuthTabType = 'login' | 'register' | 'profile' | 'password-reset';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  activeModal: ModalType;
  authTab: AuthTabType;
  toastMessage: { text: string; type: 'info' | 'success' | 'error' } | null;
  openModal: (type: ModalType, tab?: AuthTabType) => void;
  closeModal: () => void;
  showToast: (text: string, type?: 'info' | 'success' | 'error') => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [authTab, setAuthTab] = useState<AuthTabType>('login');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const u = await api.getCurrentUser();
      setUser(u);
    } catch {
      removeStoredToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const openModal = (type: ModalType, tab?: AuthTabType) => {
    setActiveModal(type);
    if (tab) {
      setAuthTab(tab);
    }
  };

  const closeModal = () => {
    setActiveModal('none');
  };

  const login = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    setUser(data.user);
    showToast(`Welcome back, ${data.user.name}! Authenticated as [${data.user.role.toUpperCase()}].`, 'success');
    closeModal();
  };

  const register = async (email: string, pass: string, name: string, role?: string) => {
    const data = await api.register(email, pass, name, role);
    setUser(data.user);
    showToast(`Account registered successfully. Welcome, ${data.user.name}!`, 'success');
    closeModal();
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    showToast('You have been logged out of Aegis-Agent.', 'info');
    closeModal();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        activeModal,
        authTab,
        toastMessage,
        openModal,
        closeModal,
        showToast,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
