import { Redirect } from 'expo-router';

import { useApp } from '@/context/AppContext';

export default function Index() {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Redirect href="/welcome" />;
  return <Redirect href="/(tabs)" />;
}
