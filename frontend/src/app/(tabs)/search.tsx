import { useRouter } from 'expo-router';

import { SearchScreen } from '@/components/SearchScreen';
import { useApp } from '@/context/AppContext';
import { mockPoliticians } from '@/data/mockPoliticians';
import { mockProjects } from '@/data/mockProjects';

export default function SearchTab() {
  const router = useRouter();
  const {
    isGuest,
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    toggleSavePolitician,
    showToastMsg,
  } = useApp();

  const requireLogin = () => {
    showToastMsg('Faça login para salvar projetos e seguir parlamentares.');
  };

  return (
    <SearchScreen
      projects={mockProjects}
      politicians={mockPoliticians}
      savedProjects={savedProjects}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) {
          requireLogin();
          return;
        }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onToggleSavePolitician={(id) => {
        if (isGuest) {
          requireLogin();
          return;
        }
        toggleSavePolitician(id);
      }}
    />
  );
}