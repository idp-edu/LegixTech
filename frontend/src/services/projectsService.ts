import { api } from "./api";

export type Projeto = {
  id?: number;
  externalId?: string;
  titulo: string;
  ementa?: string;
  situacao?: string;
  autor?: string;
  ano?: number;
  tipo?: string;
  temas?: string[];
  ods?: number[];
  estagioAtual?: number;
  fonte?: string;
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

  if (params.q) searchParams.set("q", params.q);
  if (params.tipo) searchParams.set("tipo", params.tipo);
  if (params.ano) searchParams.set("ano", String(params.ano));
  if (params.ods) searchParams.set("ods", String(params.ods));
  if (params.pagina) searchParams.set("pagina", String(params.pagina));
  if (params.porPagina) searchParams.set("porpagina", String(params.porPagina));

  return searchParams.toString();
}

async function request<T>(path: string): Promise<T> {
  return api.get<T>(path);
}

export const projectsService = {
  listar: (params: ListarProjetosParams = {}) => {
    const query = buildQuery(params);
    return request<ProjetosResponse>(`/projetos${query ? `?${query}` : ""}`);
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