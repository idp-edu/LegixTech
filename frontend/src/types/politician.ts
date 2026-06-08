export interface ApiPolitician {
  id?: number;
  external_id: string;
  nome: string;
  partido: string | null;
  estado: string | null;
  casa?: string;
  foto: string | null;
}

export interface ApiPoliticiansResponse {
  total: number;
  pagina: number;
  por_pagina: number;
  fonte: string;
  resultados: ApiPolitician[];
}

export interface UiPolitician {
  id: string;
  name: string;
  party: string;
  state: string;
  photoUrl: string | null;
}