import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { registerUnauthorizedHandler, api } from '@/services/api';
import {
  clearAuthStorage,
  getToken,
  getUser,
  removeToken,
  removeUser,
  saveToken,
  saveUser,
  getSavedProjects,
  saveSavedProjects,
  getRecentProjects,
  saveRecentProjects,
  getSavedPoliticians,
  saveSavedPoliticians,
} from '@/services/storage';
import type { AuthMode, AuthUser } from '@/types/auth';
import { API_URL } from '@/config/env';
import { fetchSavedProjectIds } from '@/services/savedService';

interface AppContextValue {
  isAuthenticated: boolean;
  isGuest: boolean;
  authMode: AuthMode;
  user: AuthUser | null;
  token: string | null;
  isDark: boolean;
  savedProjects: string[];
  savedPoliticians: string[];
  recentProjects: string[];
  showOnboarding: boolean;
  showDigestStories: boolean;
  showChatbot: boolean;
  chatbotContext: string;
  toastMessage: string;
  showToast: boolean;
  loginWithPassword: (payload: { token: string; user?: AuthUser }) => Promise<void>;
  loginWithGoogle: (payload: { token: string; user?: AuthUser }) => Promise<void>;
  registerWithPassword: (payload: { token: string; user?: AuthUser }) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
  toggleTheme: () => void;
  toggleSaveProject: (id: string) => Promise<void>;
  addRecentProject: (id: string) => void;
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

  const [isDark, setIsDark] = useState(false);
  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [savedPoliticians, setSavedPoliticians] = useState<string[]>([]);
  const [recentProjects, setRecentProjects] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDigestStories, setShowDigestStories] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState('projeto de lei');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const validateToken = async (storedToken: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: 'application/json',
        },
      });
      return response.ok;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    const hydrate = async () => {
      const [storedToken, storedUser, storedSaved, storedRecent, storedPoliticians] = await Promise.all([
        getToken(),
        getUser<AuthUser>(),
        getSavedProjects(),
        getRecentProjects(),
        getSavedPoliticians(),
      ]);

      setSavedProjects(storedSaved);
      setRecentProjects(storedRecent);
      setSavedPoliticians(storedPoliticians);

      if (storedToken && storedUser) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setTokenState(storedToken);
          setUserState(storedUser);
          setAuthMode(storedUser.provider ?? 'password');

          const backendIds = await fetchSavedProjectIds();
          if (backendIds.length > 0) {
            setSavedProjects(backendIds);
            await saveSavedProjects(backendIds);
          }
        } else {
          await clearAuthStorage();
          setTokenState(null);
          setUserState(null);
          setAuthMode(null);
        }
      } else {
        await clearAuthStorage();
        setTokenState(null);
        setUserState(null);
        setAuthMode(null);
      }

      setIsHydrated(true);
    };

    hydrate();
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      setAuthMode(null);
      setTokenState(null);
      setUserState(null);
      setShowOnboarding(false);
      setShowChatbot(false);
    });
  }, []);

  const persistSession = useCallback(async (payload: SessionPayload) => {
    const nextUser = payload.user ?? null;
    setAuthMode(payload.mode);
    setTokenState(payload.token);
    setUserState(nextUser);
    await Promise.all([saveToken(payload.token), saveUser(nextUser)]);

    const backendIds = await fetchSavedProjectIds();
    if (backendIds.length > 0) {
      setSavedProjects(backendIds);
      await saveSavedProjects(backendIds);
    }
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

  const registerWithPassword = useCallback(
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
    setSavedProjects([]);
    setSavedPoliticians([]);
    setRecentProjects([]);
    await Promise.all([
      clearAuthStorage(),
      saveSavedProjects([]),
      saveRecentProjects([]),
      saveSavedPoliticians([]),
    ]);
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

  // Corrigido: sincroniza com o backend antes de atualizar estado local
  const toggleSaveProject = useCallback(async (id: string) => {
    const isAlreadySaved = savedProjects.includes(id);
    try {
      if (isAlreadySaved) {
        await api.delete(`/salvos/${id}`);
      } else {
        await api.post(`/salvos/${id}`, {});
      }
      setSavedProjects((prev) => {
        const next = isAlreadySaved ? prev.filter((p) => p !== id) : [...prev, id];
        saveSavedProjects(next);
        return next;
      });
    } catch {
      // Não atualiza o estado local se o backend falhou
    }
  }, [savedProjects]);

  const addRecentProject = useCallback((id: string) => {
    setRecentProjects((prev) => {
      const filtered = prev.filter((p) => p !== id);
      const next = [id, ...filtered].slice(0, 20);
      saveRecentProjects(next);
      return next;
    });
  }, []);

  const toggleSavePolitician = useCallback((id: string) => {
    setSavedPoliticians((prev) => {
      const next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      saveSavedPoliticians(next);
      return next;
    });
  }, []);

  const removePolitician = useCallback((id: string) => {
    setSavedPoliticians((prev) => {
      const next = prev.filter((p) => p !== id);
      saveSavedPoliticians(next);
      return next;
    });
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
    recentProjects,
    showOnboarding,
    showDigestStories,
    showChatbot,
    chatbotContext,
    toastMessage,
    showToast,
    loginWithPassword,
    loginWithGoogle,
    registerWithPassword,
    continueAsGuest,
    logout,
    setUser,
    setToken,
    toggleTheme,
    toggleSaveProject,
    addRecentProject,
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