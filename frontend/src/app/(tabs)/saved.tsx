import { useRouter } from 'expo-router';

import { SavedProjects } from '@/components/SavedProjects';
import { useApp } from '@/context/AppContext';
import { mockPoliticians } from '@/data/mockPoliticians';
import { mockProjects } from '@/data/mockProjects';

export default function SavedTab() {
  const router = useRouter();
  const {
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    removePolitician,
    showToastMsg,
  } = useApp();

  const projects = mockProjects.filter((p) => savedProjects.includes(p.id));

  return (
    <SavedProjects
      projects={projects}
      politicians={mockPoliticians}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}`)}
      onToggleSave={toggleSaveProject}
      onPoliticianClick={(id) => router.push(`/politician/${id}`)}
      onRemovePolitician={removePolitician}
      onNavigateToSearch={() => router.push('/(tabs)/search')}
      onShowToast={showToastMsg}
    />
  );
}
