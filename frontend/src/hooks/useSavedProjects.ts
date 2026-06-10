import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { mapApiProjectToUiProject } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

type UseSavedProjectsResult = {
  savedProjects: string[];
  savedProjectsList: UiProject[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
};

export function useSavedProjects(): UseSavedProjectsResult {
  const { savedProjects, toggleSaveProject, isGuest, showToastMsg } = useApp();
  const [projectsCache, setProjectsCache] = useState<Record<string, UiProject>>({});

  useEffect(() => {
    const missing = savedProjects.filter((id) => !projectsCache[id]);
    if (!missing.length) return;

    missing.forEach(async (id) => {
      try {
        const raw = await projectsService.detalhar(id);
        const mapped = mapApiProjectToUiProject(raw);
        setProjectsCache((prev) => ({ ...prev, [id]: mapped }));
      } catch {
        // silencia erro individual para não quebrar os outros
      }
    });
  }, [savedProjects]);

  const savedProjectsList = useMemo(
    () => savedProjects.map((id) => projectsCache[id]).filter(Boolean) as UiProject[],
    [savedProjects, projectsCache],
  );

  const isSaved = useCallback(
    (id: string) => savedProjects.includes(id),
    [savedProjects],
  );

  const toggle = useCallback(
    (id: string) => {
      if (isGuest) {
        showToastMsg('Faça login para salvar projetos.');
        return;
      }
      toggleSaveProject(id);
    },
    [isGuest, showToastMsg, toggleSaveProject],
  );

  return { savedProjects, savedProjectsList, isSaved, toggle };
}