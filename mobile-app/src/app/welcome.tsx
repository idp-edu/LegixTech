import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useApp } from '@/context/AppContext';

export default function WelcomeRoute() {
  const router = useRouter();
  const { login, isAuthenticated } = useApp();

  useEffect(() => {
    if (isAuthenticated) router.replace('/(tabs)');
  }, [isAuthenticated, router]);

  return <WelcomeScreen onLogin={login} />;
}
