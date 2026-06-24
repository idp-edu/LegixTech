import { api } from './api';
import type { UiProject } from '@/types/project';

export async function fetchSavedProjectIds(): Promise<string[]> {
  try {
    const response = await api.get<{ projetos: { external_id: string }[]; total: number }>('/salvos/');
    return response.projetos.map((p) => p.external_id);
  } catch {
    return [];
  }
}

export async function fetchSavedProjects(): Promise<UiProject[]> {
  try {
    const response = await api.get<{
      projetos: {
        external_id: string;
        titulo?: string;
        ementa?: string;
        headline?: string;
        situacao?: string;
        autor?: string;
        ano?: number;
        tipo?: string;
      }[];
      total: number;
    }>('/salvos/');

    return response.projetos.map((p) => ({
      id: p.external_id,
      title: p.titulo ?? 'Sem título',
      headline: p.headline ?? p.ementa ?? '',
      ementa: p.ementa,
      year: p.ano ? String(p.ano) : '',
      status: 'active' as const,
      category: p.tipo ?? '',
      ods: [],
      sponsor: p.autor,
    }));
  } catch {
    return [];
  }
}