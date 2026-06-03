import { useRouter } from 'expo-router';

import { SearchScreen } from '@/components/SearchScreen';
import { useApp } from '@/context/AppContext';
import { mockPoliticians } from '@/data/mockPoliticians';
import { mockProjects } from '@/data/mockProjects';

export default function SearchTab() {
  const router = useRouter();
  const { savedProjects, savedPoliticians, toggleSaveProject, toggleSavePolitician } = useApp();

  return (
    <SearchScreen
      projects={mockProjects}
      politicians={mockPoliticians}
      savedProjects={savedProjects}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}`)}
      onToggleSave={toggleSaveProject}
      onPoliticianClick={(id) => router.push(`/politician/${id}`)}
      onToggleSavePolitician={toggleSavePolitician}
    />
  );
}
