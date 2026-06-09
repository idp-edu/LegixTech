import { api } from './api';

export interface Project {
  id: string;
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

export async function listarProjetos(params?: {
  q?: string;
  tipo?: string;
  ano?: number;
  ods?: number;
  pagina?: number;
  por_pagina?: number;
}): Promise<ProjectsResponse> {
  // Trailing slash evita 307 redirect do FastAPI
  const qs = buildQuery(params ?? {});
  return api.get<ProjectsResponse>(`/projetos/${qs ? `?${qs}` : ''}`);
}

export async function buscarEstatisticas(): Promise<Estatisticas> {
  return api.get<Estatisticas>('/projetos/estatisticas/', undefined, false);
}

export async function buscarResumoProjeto(external_id: string): Promise<{
  resumo: string;
  fonte: string;
}> {
  return api.get(`/projetos/${external_id}/resumo-acessivel/`);
}

export async function detalharProjeto(external_id: string): Promise<Project> {
  return api.get<Project>(`/projetos/${external_id}/`);
}