import { useRouter } from 'expo-router';

import { SavedProjects } from '@/components/SavedProjects';
import { useApp } from '@/context/AppContext';
import { mockPoliticians } from '@/data/mockPoliticians';
import { mockProjects } from '@/data/mockProjects';
import type { ProjectStatus } from '@/types/project';

export default function SavedTab() {
  const router = useRouter();
  const {
    isGuest,
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    removePolitician,
    showToastMsg,
  } = useApp();

  const projects = mockProjects
    .filter((p) => savedProjects.includes(String(p.id ?? p.externalId ?? '')))
    .map((project) => ({
      id: String(project.id ?? project.externalId ?? ''),
      title: project.title,
      year: String(project.year ?? ''),
      status: (project.status ?? 'pending') as ProjectStatus,
      category: project.source ?? project.type ?? 'Projeto',
    }));

  const requireLogin = () => {
    showToastMsg('Faça login para acessar e gerenciar seus itens salvos.');
  };

  return (
    <SavedProjects
      projects={projects}
      politicians={mockPoliticians}
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
      onRemovePolitician={(id) => {
        if (isGuest) {
          requireLogin();
          return;
        }
        removePolitician(id);
      }}
      onNavigateToSearch={() => router.push('/(tabs)/search' as never)}
      onShowToast={showToastMsg}
    />
  );
}