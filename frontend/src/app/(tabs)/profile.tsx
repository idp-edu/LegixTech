import { useRouter } from 'expo-router';

import { ProfileScreen } from '@/components/ProfileScreen';
import { useApp } from '@/context/AppContext';

export default function ProfileTab() {
  const router = useRouter();
  const { logout, setShowOnboarding } = useApp();

  return (
    <ProfileScreen
      onLogout={async () => {
        await logout();
        router.replace('/welcome' as never);
      }}
      onRestartTutorial={() => setShowOnboarding(true)}
      onNavigateToSaved={() => router.push('/(tabs)/saved' as never)}
    />
  );
}