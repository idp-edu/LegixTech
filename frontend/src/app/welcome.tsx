import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { WelcomeScreen } from '@/components/WelcomeScreen';
import { useApp } from '@/context/AppContext';

export default function WelcomeRoute() {
  const router = useRouter();
  const { loginWithGoogle, continueAsGuest, isAuthenticated, isGuest } = useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuest, router]);

  const handleLogin = async (type: 'google' | 'biometric' | 'guest') => {
    if (type === 'guest' || type === 'biometric') {
      continueAsGuest();
      return;
    }

    if (type === 'google') {
      setLoading(true);
      try {
        // Em produção: usar expo-auth-session para obter id_token real do Google
        // Por ora, entra direto como visitante com aviso informativo
        Alert.alert(
          'Login com Google',
          'Login real com Google requer configuração do OAuth. Entrando como visitante.',
          [{ text: 'OK', onPress: () => continueAsGuest() }]
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return <WelcomeScreen onLogin={handleLogin} loading={loading} />;
}
