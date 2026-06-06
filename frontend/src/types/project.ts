export interface ApiProject {
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
}

export interface ApiProjectsResponse {
  dados: ApiProject[];
  total: number;
  pagina: number;
  fonte?: string;
  erro_upstream?: boolean | string;
}

export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface UiProject {
  id: string;           
  title: string;
  year: string;         
  status: ProjectStatus;
  category: string;
  summary?: string;
  sponsor?: string;
  themes: string[];
  ods: number[];
  trending?: boolean;
  impact?: string[];
  affected?: string[];
  introduced?: string;
}

export type Project = UiProject;