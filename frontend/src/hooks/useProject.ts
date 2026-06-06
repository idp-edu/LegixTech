import { useEffect, useState } from 'react';

import { mockProjects } from '@/data/mockProjects';
import { projectsService } from '@/services/projectsService';
import { mapApiProjectToUiProject } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

type UseProjectResult = {
  project: UiProject | null;
  loading: boolean;
  error: string | null;
};

const USE_MOCK = true; // mude para false quando o back estiver rodando

export function useProject(id: string | undefined): UseProjectResult {
  const [project, setProject] = useState<UiProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      try {
        if (USE_MOCK) {
          const found = mockProjects.find((p) => p.id === id);
          setProject(found ?? null);
        } else {
          const apiProject = await projectsService.detalhe(id);
          setProject(mapApiProjectToUiProject(apiProject));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar projeto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, loading, error };
}