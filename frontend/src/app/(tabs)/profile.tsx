import { useRouter } from 'expo-router';

import { ProfileScreen } from '@/components/ProfileScreen';
import { useApp } from '@/context/AppContext';
import { mockPoliticians } from '@/data/mockPoliticians';
import { mockProjects } from '@/data/mockProjects';

export default function ProfileTab() {
  const router = useRouter();
  const { savedProjects, savedPoliticians, logout, setShowOnboarding } = useApp();

  return (
    <ProfileScreen
      onLogout={() => {
        logout();
        router.replace('/welcome');
      }}
      onRestartTutorial={() => setShowOnboarding(true)}
      onNavigateToSaved={() => router.push('/(tabs)/saved')}
      savedProjects={mockProjects
        .filter((p) => savedProjects.includes(p.id))
        .map((p) => ({ id: p.id, title: p.title, status: p.status }))}
      followedPoliticians={mockPoliticians
        .filter((p) => savedPoliticians.includes(p.id))
        .map((p) => ({
          id: p.id,
          name: p.name,
          party: p.party,
          focus: p.bio.split('.')[0],
        }))}
    />
  );
}
