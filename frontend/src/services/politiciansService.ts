import { api } from './api';
import type { ApiPoliticiansResponse } from '@/types/politician';

export interface FollowedPolitician {
  id: number;
  user_id: number;
  politician_id: number;
  created_at: string;
  politician_name: string | null;
  politician_party: string | null;
  politician_state: string | null;
  politician_photo_url: string | null;
  politician_external_id: string | null;
}

type ListarPoliticosParams = {
  nome?: string;
  partido?: string;
  estado?: string;
  casa?: string;
  pagina?: number;
  por_pagina?: number;
};

function buildQuery(params: ListarPoliticosParams): string {
  const searchParams = new URLSearchParams();
  if (params.nome) searchParams.set('nome', params.nome);
  if (params.partido) searchParams.set('partido', params.partido);
  if (params.estado) searchParams.set('estado', params.estado);
  if (params.casa && params.casa !== 'Todos') searchParams.set('casa', params.casa);
  if (params.pagina !== undefined) searchParams.set('pagina', String(params.pagina));
  if (params.por_pagina !== undefined) searchParams.set('por_pagina', String(params.por_pagina));
  return searchParams.toString();
}

export const politiciansService = {
  listar: (params: ListarPoliticosParams = {}) => {
    const query = buildQuery(params);
    return api.get<ApiPoliticiansResponse>(`/politicos/${query ? `?${query}` : ''}`);
  },

  detalhe: (externalId: string) => {
    return api.get<unknown>(`/politicos/${externalId}/`);
  },

  projetos: (externalId: string) => {
    return api.get<unknown>(`/politicos/${externalId}/projetos/`);
  },

  votacoes: (externalId: string) => {
    return api.get<unknown>(`/politicos/${externalId}/votacoes/`);
  },

  getSeguindo: () => {
    return api.get<FollowedPolitician[]>('/seguindo/');
  },

  seguir: (externalId: string) => {   // ← era number, agora string
    return api.post<FollowedPolitician>(`/seguindo/${externalId}`);
  },

  deixarDeSeguir: (externalId: string) => {   // ← era number, agora string
    return api.delete(`/seguindo/${externalId}`);
  },
};