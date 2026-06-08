import { Redirect } from 'expo-router';

import { useApp } from '@/context/AppContext';

export default function Index() {
  const { isAuthenticated, isGuest } = useApp();

  if (!isAuthenticated && !isGuest) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}