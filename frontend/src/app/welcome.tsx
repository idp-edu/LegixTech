import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useApp } from '@/context/AppContext';
import { authService } from '@/services/authService';

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

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, router]);

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
        await loginWithPassword({
          token: response.access_token,
          user: {
            id: String(response.user?.id ?? ''),
            name: response.user?.name ?? '',
            email: response.user?.email ?? credentials.email,
            provider: 'password',
          },
        });
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
        await registerWithPassword({
          token: response.access_token,
          user: {
            id: String(response.user?.id ?? ''),
            name: response.user?.name ?? credentials.name ?? '',
            email: response.user?.email ?? credentials.email,
            provider: 'password',
          },
        });
      } catch (err: any) {
        Alert.alert('Erro ao criar conta', err?.message ?? 'Verifique os dados e tente novamente.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (type === 'google') {
      setLoading(true);
      try {
        Alert.alert(
          'Login com Google',
          'Login real com Google requer configuração do OAuth. Entrando como visitante.',
          [{ text: 'OK', onPress: () => continueAsGuest() }],
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return <WelcomeScreen onLogin={handleLogin} loading={loading} />;
}