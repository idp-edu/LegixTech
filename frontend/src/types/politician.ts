export interface ApiPolitician {
  id?:         number;
  external_id: string;
  // Suporte a ambos os schemas (português e inglês) durante transição
  nome?:       string;
  name?:       string;
  partido?:    string | null;
  party?:      string | null;
  estado?:     string | null;
  state?:      string | null;
  casa?:       string;
  foto?:       string | null;
  photo_url?:  string | null;
}

export interface ApiPoliticiansResponse {
  total:      number;
  pagina:     number;
  por_pagina: number;
  fonte:      string;
  resultados: ApiPolitician[];
}

export interface UiPolitician {
  id:       string;
  name:     string;
  party:    string;
  state:    string;
  photoUrl: string | null;
}

/** Tipo completo usado nas telas — inclui house, photo e stats */
export interface Politician {
  id:     string;
  name:   string;
  party:  string;
  state:  string;
  house:  'Senado' | 'Câmara';
  photo?: string;
  bio:    string;
  stats: {
    totalVotes:         number;
    votesInFavor:       number;
    votesAgainst:       number;
    abstentions:        number;
    projectsPresented:  number;
    attendance:         number;
  };
}