import type { ApiPolitician, UiPolitician } from '@/types/politician';

export function mapApiPoliticianToUi(p: ApiPolitician): UiPolitician {
  return {
    id: p.external_id ?? String(p.id ?? ''),
    name: p.nome,
    party: p.partido ?? '',
    state: p.estado ?? '',
    photoUrl: p.foto ?? null,
  };
}

export function mapApiPoliticianListToUi(politicians: ApiPolitician[]): UiPolitician[] {
  return politicians.map(mapApiPoliticianToUi);
}