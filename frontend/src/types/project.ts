export interface ApiProject {
  id?: number;
  externalId?: string;
  external_id?: string;
  title?: string;
  titulo?: string;
  ementa?: string;
  year?: number;
  ano?: number;
  status?: string;
  situacao?: string;
  summary?: string;
  sponsor?: string;
  autor?: string;
  category?: string;
  tipo?: string;
  themes?: string[];
  temas?: string[];
  ods?: number[];
}

export type ApiProjectList = {
  dados: ApiProject[];
  total: number;
  pagina: number;
  porPagina?: number;
};

export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface UiProject {
  id: string;
  title: string;
  year: string;
  status: ProjectStatus;
  summary?: string;
  sponsor?: string;
  category: string;
  themes?: string[];
  ods: number[];
  // propriedades extras usadas nos detalhes e mock
  trending?: boolean;
  impact?: string[];
  affected?: string[];
  introduced?: string;
}

export type Project = UiProject;