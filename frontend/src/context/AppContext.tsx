import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import type { UserType } from '@/types/project';

interface AppContextValue {
  isAuthenticated: boolean;
  userType: UserType;
  isDark: boolean;
  savedProjects: string[];
  savedPoliticians: string[];
  showOnboarding: boolean;
  showDigestStories: boolean;
  showChatbot: boolean;
  chatbotContext: string;
  toastMessage: string;
  showToast: boolean;
  login: (type: NonNullable<UserType>) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleSaveProject: (id: string) => void;
  toggleSavePolitician: (id: string) => void;
  removePolitician: (id: string) => void;
  setShowOnboarding: (v: boolean) => void;
  setShowDigestStories: (v: boolean) => void;
  openChatbot: (context?: string) => void;
  closeChatbot: () => void;
  showToastMsg: (message: string) => void;
  hideToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [savedProjects, setSavedProjects] = useState<string[]>(['4', '5']);
  const [savedPoliticians, setSavedPoliticians] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDigestStories, setShowDigestStories] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState('projeto de lei');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const login = useCallback((type: NonNullable<UserType>) => {
    setUserType(type);
    setIsAuthenticated(true);
    if (type !== 'guest') setShowOnboarding(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserType(null);
    setShowOnboarding(false);
    setShowChatbot(false);
  }, []);

  const toggleTheme = useCallback(() => setIsDark((p) => !p), []);

  const toggleSaveProject = useCallback((id: string) => {
    setSavedProjects((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }, []);

  const toggleSavePolitician = useCallback((id: string) => {
    setSavedPoliticians((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  }, []);

  const removePolitician = useCallback((id: string) => {
    setSavedPoliticians((prev) => prev.filter((p) => p !== id));
  }, []);

  const openChatbot = useCallback((context = 'projeto de lei') => {
    setChatbotContext(context);
    setShowChatbot(true);
  }, []);

  const closeChatbot = useCallback(() => setShowChatbot(false), []);

  const showToastMsg = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const hideToast = useCallback(() => setShowToast(false), []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userType,
      isDark,
      savedProjects,
      savedPoliticians,
      showOnboarding,
      showDigestStories,
      showChatbot,
      chatbotContext,
      toastMessage,
      showToast,
      login,
      logout,
      toggleTheme,
      toggleSaveProject,
      toggleSavePolitician,
      removePolitician,
      setShowOnboarding,
      setShowDigestStories,
      openChatbot,
      closeChatbot,
      showToastMsg,
      hideToast,
    }),
    [
      isAuthenticated,
      userType,
      isDark,
      savedProjects,
      savedPoliticians,
      showOnboarding,
      showDigestStories,
      showChatbot,
      chatbotContext,
      toastMessage,
      showToast,
      login,
      logout,
      toggleTheme,
      toggleSaveProject,
      toggleSavePolitician,
      removePolitician,
      openChatbot,
      closeChatbot,
      showToastMsg,
      hideToast,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
