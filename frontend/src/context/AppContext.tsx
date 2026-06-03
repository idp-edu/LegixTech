import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { clearAuthStorage, getToken, getUser, saveToken, saveUser } from '@/services/storage';

export type AuthMode = 'password' | 'google' | 'guest' | null;

export type AppUser = {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  photoUrl?: string;
  provider?: 'password' | 'google';
} | null;

type LoginPayload = {
  token: string;
  user?: AppUser;
  mode: Exclude<AuthMode, null>;
};

interface AppContextValue {
  isAuthenticated: boolean;
  isGuest: boolean;
  authMode: AuthMode;
  user: AppUser;
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
  loginWithPassword: (payload: Omit<LoginPayload, 'mode'>) => Promise<void>;
  loginWithGoogle: (payload: Omit<LoginPayload, 'mode'>) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  setUser: (user: AppUser) => void;
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

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();

  const [isHydrated, setIsHydrated] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const [user, setUserState] = useState<AppUser>(null);
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
      const [storedToken, storedUser] = await Promise.all([getToken(), getUser<AppUser>()]);
      if (storedToken) {
        setTokenState(storedToken);
        setUserState(storedUser ?? null);
        setAuthMode(storedUser?.provider ?? 'password');
      }
      setIsHydrated(true);
    };

    hydrate();
  }, []);

  const persistSession = useCallback(async (payload: LoginPayload) => {
    setAuthMode(payload.mode);
    setTokenState(payload.token);
    setUserState(payload.user ?? null);
    await Promise.all([saveToken(payload.token), saveUser(payload.user ?? null)]);
  }, []);

  const loginWithPassword = useCallback(
    async ({ token: nextToken, user: nextUser }: Omit<LoginPayload, 'mode'>) => {
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
    async ({ token: nextToken, user: nextUser }: Omit<LoginPayload, 'mode'>) => {
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
    setUserState({ provider: 'password' });
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
      await clearAuthStorage();
    }
  }, []);

  const setUser = useCallback((nextUser: AppUser) => {
    setUserState(nextUser);
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
    }),
    [
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
      openChatbot,
      closeChatbot,
      showToastMsg,
      hideToast,
    ],
  );

  if (!isHydrated) return null;

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}