import { useMemo } from 'react';

import { mockProjects } from '@/data/mockProjects';
import { useApp } from '@/context/AppContext';
import type { UiProject } from '@/types/project';

type UseSavedProjectsResult = {
  savedProjects: string[];
  savedProjectsList: UiProject[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
};

export function useSavedProjects(): UseSavedProjectsResult {
  const { savedProjects, toggleSaveProject, isGuest, showToastMsg } = useApp();

  const savedProjectsList = useMemo(
    () => mockProjects.filter((p) => savedProjects.includes(p.id)),
    [savedProjects],
  );

  const isSaved = (id: string) => savedProjects.includes(id);

  const toggle = (id: string) => {
    if (isGuest) {
      showToastMsg('Faça login para salvar projetos.');
      return;
    }
    toggleSaveProject(id);
  };

  return { savedProjects, savedProjectsList, isSaved, toggle };
}