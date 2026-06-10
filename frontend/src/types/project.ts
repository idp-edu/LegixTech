// ─── Tipos da API (o que vem do backend) ────────────────────────────────────

export interface ApiProjectAutor {
  nome?: string;
  name?: string;
}

export interface ApiProjectTramitacao {
  data?: string;
  descricao?: string;
  etapa?: string;
}

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
  autor_principal?: string;
  autores?: ApiProjectAutor[];
  category?: string;
  tipo?: string;
  siglaTipo?: string;
  descricaoTipo?: string;
  themes?: string[];
  temas?: string[];
  ods?: number[];
  url_texto_oficial?: string;
  url_oficial?: string;
  link_oficial?: string;
  link?: string;
  data_apresentacao?: string;
  dataApresentacao?: string;
  tramitacoes?: ApiProjectTramitacao[];
}

export type ApiProjectList = {
  dados: ApiProject[];
  total: number;
  pagina: number;
  porPagina?: number;
};

// ─── Tipos da UI (o que o app usa internamente) ──────────────────────────────

export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface TimelineEvent {
  date: string;
  label: string;
  status?: ProjectStatus;
}

export interface UiProject {
  id: string;
  externalId?: string;
  title: string;
  year: string;
  status: ProjectStatus;
  summary?: string;
  sponsor?: string;
  category: string;
  source?: string;
  themes?: string[];
  ods: number[];
  officialUrl?: string;       // ← novo: link para o texto oficial
  timeline?: TimelineEvent[]; // ← novo: eventos de tramitação
  trending?: boolean;
  impact?: string[];
  affected?: string[];
  introduced?: string;
}

export type Project = UiProject;