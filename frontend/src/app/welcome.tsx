import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useApp } from '@/context/AppContext';

export default function WelcomeRoute() {
  const router = useRouter();
  const { loginWithGoogle, continueAsGuest, isAuthenticated, isGuest } = useApp();

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, router]);

  const handleLogin = async (type: 'google' | 'biometric' | 'guest') => {
    if (type === 'google') {
      await loginWithGoogle({
        token: 'mock-google-token',
        user: {
          name: 'Usuário Google',
          email: 'google@example.com',
          provider: 'google',
        },
      });
      return;
    }

    if (type === 'guest') {
      continueAsGuest();
      return;
    }

    if (type === 'biometric') {
      continueAsGuest();
      return;
    }
  };

  return <WelcomeScreen onLogin={handleLogin} />;
}