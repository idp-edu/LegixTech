import { useEffect, useState } from 'react';
import { projectsService } from '@/services/projectsService';
import { mapApiProjectToUiProject } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';

type UseProjectResult = {
  project: UiProject | null;
  loading: boolean;
  error: string | null;
};

export function useProject(id: string | undefined): UseProjectResult {
  const [project, setProject] = useState<UiProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('ID do projeto não informado.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    projectsService
      .detalhar(id)
      .then((raw: any) => {
        const mapped = mapApiProjectToUiProject(raw);
        // Tenta buscar resumo acessível gerado por IA; usa ementa como fallback
        projectsService
          .resumo(mapped.id)
          .then(({ resumo }) => {
            setProject({ ...mapped, summary: resumo });
          })
          .catch(() => {
            setProject(mapped);
          });
      })
      .catch((err: any) => {
        setError(err?.message ?? 'Erro ao carregar projeto.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { project, loading, error };
}