export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface ApiProject {
  id: number;
  externalId?: string;
  title: string;
  year: number;
  status: string;
  sponsor: string;
  themes?: string[];
  ods?: number[];
}

export interface UiProject {
  id: string;
  title: string;
  year: string;
  status: ProjectStatus;
  category: string;
  summary: string;
  sponsor: string;
  themes: string[];
  ods: number[];
  
  // 🚀 ADICIONADO: Propriedades opcionais necessárias para o Mock e Telas de Detalhes
  trending?: boolean;
  impact?: string[];
  affected?: string[];
  introduced?: string;
}
