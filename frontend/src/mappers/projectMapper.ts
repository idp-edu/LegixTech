import type {
  ApiProject,
  UiProject,
  ProjectStatus,
  TimelineEvent,
} from '@/types/project';

// ─── Mapa de status ──────────────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractSponsor(p: any): string {
  // 1. lista de autores com campo .nome ou .name
  if (Array.isArray(p.autores) && p.autores.length > 0) {
    const nomes = p.autores
      .map((a: any) => a.nome ?? a.name ?? '')
      .filter(Boolean);
    if (nomes.length > 0) return nomes.join(', ');
  }

  // 2. campos simples (em ordem de prioridade)
  return p.autor ?? p.autor_principal ?? p.sponsor ?? '';
}

function extractOfficialUrl(p: any): string | undefined {
  return (
    p.url_texto_oficial ??
    p.url_oficial ??
    p.link_oficial ??
    p.link ??
    undefined
  );
}

function buildTimeline(p: any): TimelineEvent[] | undefined {
  const events: TimelineEvent[] = [];

  // Evento inicial: data de apresentação
  const dataApresentacao =
    p.data_apresentacao ?? p.dataApresentacao ?? undefined;

  if (dataApresentacao) {
    events.push({
      date: String(dataApresentacao),
      label: 'Projeto apresentado',
      status: 'pending',
    });
  }

  // Eventos de tramitação (se o backend enviar)
  if (Array.isArray(p.tramitacoes)) {
    p.tramitacoes.forEach((t: any) => {
      events.push({
        date: String(t.data ?? ''),
        label: t.descricao ?? t.etapa ?? 'Movimentação',
      });
    });
  }

  return events.length > 0 ? events : undefined;
}

// ─── Mapper principal ─────────────────────────────────────────────────────────

export function mapApiProjectToUiProject(p: any): UiProject {
  return {
    id: p.external_id ?? p.externalId ?? String(p.id ?? ''),
    title: p.titulo ?? p.title ?? 'Sem título',
    year: p.ano != null ? String(p.ano) : p.year != null ? String(p.year) : '',
    status: normalizeStatus(p.situacao ?? p.status),
    category: p.tipo ?? p.type ?? p.descricaoTipo ?? p.siglaTipo ?? '',
    summary: p.ementa ?? p.abstract ?? p.summary ?? '',
    sponsor: extractSponsor(p),
    themes: p.temas ?? p.themes ?? [],
    ods: Array.isArray(p.ods)
      ? p.ods.map((o: any) => (typeof o === 'object' ? o.numero : o))
      : [],
    officialUrl: extractOfficialUrl(p),
    timeline: buildTimeline(p),
  };
}

export function mapApiListToUiList(projects: any[]): UiProject[] {
  return projects.map(mapApiProjectToUiProject);
}