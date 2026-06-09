import type { ApiProject, UiProject, ProjectStatus } from '@/types/project'; 

const STATUS_MAP: Record<string, ProjectStatus> = { 
  active: 'active', 
  pending: 'pending', 
  archived: 'archived', 
  approved: 'approved', 
}; 

function normalizeStatus(raw?: string): ProjectStatus { 
  if (!raw) return 'pending'; 
  return STATUS_MAP[raw.toLowerCase()] ?? 'pending'; 
} 

export function mapApiProjectToUiProject(p: ApiProject): UiProject { 
  // 🚀 CORRIGIDO: Convertemos o objeto temporariamente para 'any' para ler propriedades dinâmicas
  const raw = p as any; 

  return { 
    id: p.externalId ?? String(p.id ?? ''), 
    title: p.title, 
    year: p.year != null ? String(p.year) : '', 
    status: normalizeStatus(p.status), 
    // 💡 Busca a chave 'type' ou tenta os fallbacks estruturais da API se existirem
    category: raw.type ?? raw.descricaoTipo ?? raw.siglaTipo ?? '', 
    // 💡 Busca a chave 'abstract' ou tenta 'ementa'/'titulo' que vimos nos feeds
    summary: raw.abstract ?? raw.ementa ?? '', 
    sponsor: p.sponsor, 
    themes: p.themes ?? [], 
    ods: p.ods ?? [], 
  }; 
} 

export function mapApiListToUiList(projects: ApiProject[]): UiProject[] { 
  return projects.map(mapApiProjectToUiProject); 
}
