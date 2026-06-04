import { api } from './api';

export type Projeto = {
  id?: number;
  externalId?: string;
  title: string;
  abstract?: string;
  status?: string;
  sponsor?: string;
  year?: number;
  type?: string;
  themes?: string[];
  ods?: number[];
  currentStage?: number;
  source?: string;
};

export type ProjetosResponse = {
  dados: Projeto[];
  total: number;
  pagina: number;
  fonte?: string;
  erro_upstream?: boolean | string;
};

type ListarProjetosParams = {
  q?: string;
  tipo?: string;
  ano?: number;
  ods?: number;
  pagina?: number;
  porPagina?: number;
};

function buildQuery(params: ListarProjetosParams) {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.tipo) searchParams.set('tipo', params.tipo);
  if (params.ano !== undefined) searchParams.set('ano', String(params.ano));
  if (params.ods !== undefined) searchParams.set('ods', String(params.ods));
  if (params.pagina !== undefined) searchParams.set('pagina', String(params.pagina));
  if (params.porPagina !== undefined) searchParams.set('porPagina', String(params.porPagina));

  return searchParams.toString();
}

async function request<T>(path: string): Promise<T> {
  return api.get<T>(path);
}

export const projectsService = {
  listar: (params: ListarProjetosParams = {}) => {
    const query = buildQuery(params);
    return request<ProjetosResponse>(`/projetos${query ? `?${query}` : ''}`);
  },

  detalhe: (externalId: string) => {
    return request<Projeto>(`/projetos/${externalId}`);
  },

  tramitacao: (externalId: string) => {
    return request<unknown>(`/projetos/${externalId}/tramitacao`);
  },

  resumoAcessivel: (externalId: string) => {
    return request<unknown>(`/projetos/${externalId}/resumo-acessivel`);
  },

  temasDisponiveis: () => {
    return request<string[]>(`/projetos/temas/disponiveis`);
  },
};