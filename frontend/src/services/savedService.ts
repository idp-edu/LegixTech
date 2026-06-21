import { api } from './api';

export async function fetchSavedProjectIds(): Promise<string[]> {
  try {
    const response = await api.get<{ projetos: { external_id: string }[]; total: number }>('/salvos/');
    return response.projetos.map((p) => p.external_id);
  } catch {
    return [];
  }
}