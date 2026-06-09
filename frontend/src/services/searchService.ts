import { api } from './api';

export interface SearchParams {
  q: string;
  pagina?: number;
  porPagina?: number;
}

function buildQuery(params: SearchParams): string {
  const searchParams = new URLSearchParams();
  searchParams.set('q', params.q);
  if (params.pagina !== undefined) searchParams.set('pagina', String(params.pagina));
  if (params.porPagina !== undefined) searchParams.set('por_pagina', String(params.porPagina));
  return searchParams.toString();
}

async function request<T>(path: string): Promise<T> {
  return api.get<T>(path);
}

export const searchService = {
  searchProposicoes: (params: SearchParams) => {
    const query = buildQuery(params);
    return request<unknown>(`/projetos/?${query}`); // trailing slash evita redirect 307
  },

  searchPoliticians: (params: SearchParams) => {
    const query = buildQuery(params);
    return request<unknown>(`/politicos/?${query}`);
  },
};
