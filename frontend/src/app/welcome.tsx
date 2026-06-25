import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session/providers/google';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useApp } from '@/context/AppContext';
import { authService } from '@/services/authService';
import { getToken, getUser } from '@/services/storage';
import type { AuthUser } from '@/types/auth';

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!;

export default function WelcomeRoute() {
  const router = useRouter();
  const {
    loginWithGoogle,
    loginWithPassword,
    registerWithPassword,
    continueAsGuest,
    isAuthenticated,
    isGuest,
    showToastMsg,
  } = useApp();
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
  });

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, router]);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleToken(authentication.idToken);
      } else {
        showToastMsg('Token do Google não encontrado. Tente novamente.');
        setLoading(false);
      }
    } else if (response?.type === 'error') {
      showToastMsg('Não foi possível fazer login com Google.');
      setLoading(false);
    }
  }, [response]);

  const handleGoogleToken = async (idToken: string) => {
    setLoading(true);
    try {
      const result = await authService.loginWithGoogle({ token: idToken });
      await loginWithGoogle({ token: result.access_token, user: result.user });
    } catch (err: any) {
      showToastMsg(err?.message ?? 'Erro ao entrar com Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (
    type: 'google' | 'biometric' | 'guest' | 'password' | 'register',
    credentials?: { email: string; password: string; name?: string },
  ) => {
    if (type === 'biometric') {
      setLoading(true);
      try {
        const savedToken = await getToken();
        const savedUser = await getUser<AuthUser>();
        if (savedToken && savedUser) {
          await loginWithPassword({ token: savedToken, user: savedUser });
        } else {
          showToastMsg('Faça login uma vez para ativar a biometria.');
        }
      } catch {
        showToastMsg('Não foi possível autenticar com biometria.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === 'guest') {
      continueAsGuest();
      return;
    }

    if (type === 'password' && credentials) {
      setLoading(true);
      try {
        const res = await authService.loginWithPassword(credentials);
        await loginWithPassword({ token: res.access_token, user: res.user });
      } catch (err: any) {
        showToastMsg(err?.message ?? 'E-mail ou senha incorretos.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === 'register' && credentials) {
      setLoading(true);
      try {
        const res = await authService.registerWithPassword({
          name: credentials.name ?? '',
          email: credentials.email,
          password: credentials.password,
        });
        await registerWithPassword({ token: res.access_token, user: res.user });
      } catch (err: any) {
        showToastMsg(err?.message ?? 'Erro ao criar conta. Tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === 'google') {
      setLoading(true);
      await promptAsync();
    }
  };

  return <WelcomeScreen onLogin={handleLogin} loading={loading} />;
}