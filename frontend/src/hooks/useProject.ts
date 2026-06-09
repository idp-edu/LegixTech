import { useEffect, useState } from 'react';
import { mockProjects } from '@/data/mockProjects';
import { projectsService } from '@/services/projectsService';

export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface UiProject {
  id: string;
  title: string;
  year: string;
  status: ProjectStatus;
  category: string;
  summary: string;
  sponsor: string;
  themes: string[];
  ods: number[];
  trending?: boolean;
  impact?: string[];
  affected?: string[];
  introduced?: string;
}

type UseProjectResult = {
  project: UiProject | null;
  loading: boolean;
  error: string | null;
};

const USE_MOCK = true; // mude para false quando o backend estiver rodando

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

    if (USE_MOCK) {
      const found = mockProjects.find((p) => p.id === id) ?? null;
      setProject(found as UiProject | null);
      if (!found) setError('Projeto não encontrado.');
      setLoading(false);
      return;
    }

    projectsService
      .detalhar(id)
      .then((p: any) => {
        setProject({
          id: String(p.external_id ?? p.id),
          title: p.ementa ?? p.titulo ?? 'Sem título',
          year: String(p.ano ?? ''),
          status: normalizeStatus(p.situacao),
          category: p.tipo ?? '',
          summary: p.resumo ?? p.ementa ?? '',
          sponsor: p.autor ?? '',
          themes: p.temas ?? [],
          ods: (p.ods ?? []).map((o: any) => (typeof o === 'object' ? o.numero : o)),
        });
      })
      .catch((err: any) => {
        setError(err?.message ?? 'Erro ao carregar projeto.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { project, loading, error };
}

function normalizeStatus(situacao?: string): ProjectStatus {
  if (!situacao) return 'pending';
  const s = situacao.toLowerCase();
  if (s.includes('aprovad') || s.includes('sancion')) return 'approved';
  if (s.includes('arquivad')) return 'archived';
  if (s.includes('vota') || s.includes('pauta')) return 'pending';
  return 'active';
}