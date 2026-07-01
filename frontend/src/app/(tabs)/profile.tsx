import { useRouter } from 'expo-router';

import { ProfileScreen } from '@/components/ProfileScreen';
import { useApp } from '@/context/AppContext';

export default function ProfileTab() {
  const router = useRouter();
  const { logout, restartOnboarding } = useApp(); 

  return (
    <ProfileScreen
      onLogout={async () => {
        await logout();
        router.replace('/welcome' as never);
      }}
      onRestartTutorial={restartOnboarding} 
      onNavigateToSaved={() => router.push('/(tabs)/saved' as never)}
    />
  );
}