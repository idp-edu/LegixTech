export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface Project {
  id?: string;
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
}