import { useLocalSearchParams, useRouter } from 'expo-router';

import { PoliticianProfile } from '@/components/PoliticianProfile';
import { useApp } from '@/context/AppContext';
import { mockPoliticians, mockVotes } from '@/data/mockPoliticians';

export default function PoliticianDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { userType, savedPoliticians, toggleSavePolitician, openChatbot, showToastMsg } = useApp();

  const politician = mockPoliticians.find((p) => p.id === id);
  if (!politician) {
    router.back();
    return null;
  }

  const votes = mockVotes.filter((v) => v.politicianId === id);

  return (
    <PoliticianProfile
      politician={politician}
      votes={votes}
      onBack={() => router.back()}
      onProjectClick={(projectId) => router.push(`/project/${projectId}`)}
      onChatbotClick={userType !== 'guest' ? () => openChatbot('parlamentar') : undefined}
      isSaved={savedPoliticians.includes(id)}
      onToggleSave={toggleSavePolitician}
      onShowToast={showToastMsg}
    />
  );
}
