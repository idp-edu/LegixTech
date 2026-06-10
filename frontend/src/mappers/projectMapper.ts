import type { ApiProject, UiProject, ProjectStatus } from '@/types/project';

const STATUS_MAP: Record<string, ProjectStatus> = {
  active: 'active',
  pending: 'pending',
  archived: 'archived',
  approved: 'approved',
  'em tramitação': 'active',
  'em votação': 'active',
  'em análise': 'active',
  aprovado: 'approved',
  sancionado: 'approved',
  arquivado: 'archived',
  aguardando: 'pending',
  'aguardando votação': 'pending',
};

function normalizeStatus(raw?: string): ProjectStatus {
  if (!raw) return 'pending';
  const lower = raw.toLowerCase();
  if (STATUS_MAP[lower]) return STATUS_MAP[lower];
  if (lower.includes('aprovad') || lower.includes('sancion')) return 'approved';
  if (lower.includes('arquivad')) return 'archived';
  if (lower.includes('vota') || lower.includes('pauta')) return 'pending';
  return 'active';
}

export function mapApiProjectToUiProject(p: any): UiProject {
  return {
    id: p.external_id ?? p.externalId ?? String(p.id ?? ''),
    title: p.titulo ?? p.title ?? 'Sem título',
    year: p.ano != null ? String(p.ano) : p.year != null ? String(p.year) : '',
    status: normalizeStatus(p.situacao ?? p.status),
    category: p.tipo ?? p.type ?? p.descricaoTipo ?? p.siglaTipo ?? '',
    summary: p.ementa ?? p.abstract ?? p.summary ?? '',
    sponsor: (Array.isArray(p.autores) ? p.autores.map((a: any) => a.nome ?? a).join(', ') : null) ?? p.autor ?? p.sponsor ?? '',
    themes: p.temas ?? p.themes ?? [],
    ods: Array.isArray(p.ods)
      ? p.ods.map((o: any) => (typeof o === 'object' ? o.numero : o))
      : [],
  };
}

export function mapApiListToUiList(projects: any[]): UiProject[] {
  return projects.map(mapApiProjectToUiProject);
}