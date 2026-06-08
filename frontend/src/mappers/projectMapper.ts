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
  return {
    id: p.externalId ?? String(p.id ?? ''),
    title: p.title,
    year: p.year != null ? String(p.year) : '',
    status: normalizeStatus(p.status),
    category: p.type ?? '',
    summary: p.abstract,
    sponsor: p.sponsor,
    themes: p.themes ?? [],
    ods: p.ods ?? [],
  };
}

export function mapApiListToUiList(projects: ApiProject[]): UiProject[] {
  return projects.map(mapApiProjectToUiProject);
}