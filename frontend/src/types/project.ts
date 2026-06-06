export interface ApiProject {
  id?: number;
  externalId?: string;
  title: string;
  year?: number;
  status?: string;
  summary?: string;
  sponsor?: string;
  category?: string;
  themes?: string[];
  ods?: number[];
}

export type ApiProjectList = {
  dados: ApiProject[];
  total: number;
  pagina: number;
  porPagina: number;
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
}

export type Project = UiProject;