import { api } from './api';

export interface Project {
  id: string;
  external_id?: string;
  titulo?: string;
  title?: string;
  ementa?: string;
  situacao?: string;
  autor?: string;
  ano?: string | number;
  year?: string | number;
  tipo?: string;
  temas?: string[];
  ods?: { numero: number; nome: string }[];
  estagio_atual?: number;
  category?: string;
  status?: string;
}

export interface ProjectsResponse {
  dados: Project[];
  total: number;
  pagina: number;
}

export interface Estatisticas {
  total: number;
  em_tramitacao?: number;
  aguardando_votacao?: number;
  aprovados?: number;
  por_situacao: Record<string, number>;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  return searchParams.toString();
}

export const projectsService = {
  listar: (params?: {
    q?: string;
    tipo?: string;
    ano?: number;
    ods?: number;
    pagina?: number;
    por_pagina?: number;
  }): Promise<ProjectsResponse> => {
    const qs = buildQuery(params ?? {});
    return api.get<ProjectsResponse>(`/projetos/${qs ? `?${qs}` : ''}`);
  },

  estatisticas: (): Promise<Estatisticas> => {
    return api.get<Estatisticas>('/projetos/estatisticas/');
  },

  resumo: (external_id: string): Promise<{ resumo: string; fonte: string }> => {
    return api.get(`/projetos/${external_id}/resumo-acessivel/`);
  },

  detalhar: (external_id: string): Promise<Project> => {
    return api.get<Project>(`/projetos/${external_id}/`);
  },
};

export const listarProjetos = projectsService.listar;
export const buscarEstatisticas = projectsService.estatisticas;
export const buscarResumoProjeto = projectsService.resumo;
export const detalharProjeto = projectsService.detalhar;