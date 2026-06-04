import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import {
  clearAuthStorage,
  getToken,
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
} from '@/services/storage';
import type { AuthMode, AuthUser } from '@/types/auth';

interface AppContextValue {
  isAuthenticated: boolean;
  isGuest: boolean;
  authMode: AuthMode;
  user: AuthUser;
  token: string | null;
  isDark: boolean;
  savedProjects: string[];
  savedPoliticians: string[];
  showOnboarding: boolean;
  showDigestStories: boolean;
  showChatbot: boolean;
  chatbotContext: string;
  toastMessage: string;
  showToast: boolean;
  loginWithPassword: (payload: { token: string; user?: AuthUser }) => Promise<void>;
  loginWithGoogle: (payload: { token: string; user?: AuthUser }) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
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

type SessionPayload = {
  token: string;
  user?: AuthUser | null;
  mode: Exclude<AuthMode, null>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [isHydrated, setIsHydrated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [savedPoliticians, setSavedPoliticians] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDigestStories, setShowDigestStories] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState('projeto de lei');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const [storedToken, storedUser] = await Promise.all([
        getToken(),
        getUser<AuthUser>(),
      ]);

      if (storedToken) {
        setTokenState(storedToken);
        setUserState(storedUser ?? null);
        setAuthMode(storedUser?.provider ?? 'password');
      }

      setIsHydrated(true);
    };

    hydrate();
  }, []);

  const persistSession = useCallback(async (payload: SessionPayload) => {
    const nextUser = payload.user ?? null;
    setAuthMode(payload.mode);
    setTokenState(payload.token);
    setUserState(nextUser);
    await Promise.all([saveToken(payload.token), saveUser(nextUser)]);
  }, []);

  const loginWithPassword = useCallback(
    async ({ token: nextToken, user: nextUser }: { token: string; user?: AuthUser }) => {
      await persistSession({
        token: nextToken,
        user: nextUser ? { ...nextUser, provider: 'password' } : { provider: 'password' },
        mode: 'password',
      });
      setShowOnboarding(true);
    },
    [persistSession],
  );

  const loginWithGoogle = useCallback(
    async ({ token: nextToken, user: nextUser }: { token: string; user?: AuthUser }) => {
      await persistSession({
        token: nextToken,
        user: nextUser ? { ...nextUser, provider: 'google' } : { provider: 'google' },
        mode: 'google',
      });
      setShowOnboarding(true);
    },
    [persistSession],
  );

  const continueAsGuest = useCallback(() => {
    setAuthMode('guest');
    setTokenState(null);
    setUserState(null);
    setSavedProjects([]);
    setSavedPoliticians([]);
    setShowOnboarding(false);
    setShowChatbot(false);
  }, []);

  const logout = useCallback(async () => {
    setAuthMode(null);
    setTokenState(null);
    setUserState(null);
    setShowOnboarding(false);
    setShowChatbot(false);
    await clearAuthStorage();
  }, []);

  const setToken = useCallback(async (nextToken: string | null) => {
    setTokenState(nextToken);
    if (nextToken) {
      await saveToken(nextToken);
    } else {
      await removeToken();
    }
  }, []);

  const setUser = useCallback(async (nextUser: AuthUser | null) => {
    setUserState(nextUser);
    if (nextUser) {
      await saveUser(nextUser);
    } else {
      await removeUser();
    }
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

  const value: AppContextValue = {
    isAuthenticated: authMode === 'password' || authMode === 'google',
    isGuest: authMode === 'guest',
    authMode,
    user,
    token,
    isDark,
    savedProjects,
    savedPoliticians,
    showOnboarding,
    showDigestStories,
    showChatbot,
    chatbotContext,
    toastMessage,
    showToast,
    loginWithPassword,
    loginWithGoogle,
    continueAsGuest,
    logout,
    setUser,
    setToken,
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
  };

  if (!isHydrated) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}