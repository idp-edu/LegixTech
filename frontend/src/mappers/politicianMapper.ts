import type { ApiPolitician, UiPolitician } from '@/types/politician';

export function mapApiPoliticianToUi(p: ApiPolitician): UiPolitician {
  const name = p.nome ?? p.name ?? '';
  if (!name) {
    console.warn('[politicianMapper] Campo nome/name ausente:', JSON.stringify(p));
  }
  return {
    id:       p.external_id ?? String(p.id ?? ''),
    name,
    party:    p.partido ?? p.party ?? '',
    state:    p.estado  ?? p.state ?? '',
    photoUrl: p.foto    ?? p.photo_url ?? null,
  };
}

export function mapApiPoliticianListToUi(politicians: ApiPolitician[]): UiPolitician[] {
  return politicians.map(mapApiPoliticianToUi);
}