import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session/providers/google';
import * as Crypto from 'expo-crypto';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useApp } from '@/context/AppContext';
import { authService } from '@/services/authService';

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
      if (authentication?.accessToken) {
        handleGoogleToken(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      Alert.alert('Erro', 'Não foi possível fazer login com Google.');
      setLoading(false);
    }
  }, [response]);

  const handleGoogleToken = async (accessToken: string) => {
    setLoading(true);
    try {
      const result = await authService.loginWithGoogle({ token: accessToken });
      await loginWithGoogle({ token: result.access_token, user: result.user });
    } catch (err: any) {
      Alert.alert('Erro ao entrar com Google', err?.message ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (
    type: 'google' | 'biometric' | 'guest' | 'password' | 'register',
    credentials?: { email: string; password: string; name?: string },
  ) => {
    if (type === 'guest' || type === 'biometric') {
      continueAsGuest();
      return;
    }

    if (type === 'password' && credentials) {
      setLoading(true);
      try {
        const response = await authService.loginWithPassword(credentials);
        await loginWithPassword({ token: response.access_token, user: response.user });
      } catch (err: any) {
        Alert.alert('Erro ao entrar', err?.message ?? 'Verifique seu e-mail e senha.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === 'register' && credentials) {
      setLoading(true);
      try {
        const response = await authService.registerWithPassword({
          name: credentials.name ?? '',
          email: credentials.email,
          password: credentials.password,
        });
        await registerWithPassword({ token: response.access_token, user: response.user });
      } catch (err: any) {
        Alert.alert('Erro ao criar conta', err?.message ?? 'Verifique os dados e tente novamente.');
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