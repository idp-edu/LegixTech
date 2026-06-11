import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { SearchScreen } from '@/components/SearchScreen';
import { useApp } from '@/context/AppContext';
import { politiciansService } from '@/services/politiciansService';
import type { Politician } from '@/data/mockPoliticians';

function mapearPolitico(p: any): Politician {
  return {
    id: p.external_id ?? String(p.id),
    name: p.nome ?? '',
    party: p.partido ?? '',
    state: p.estado ?? '',
    house: (p.casa === 'Senado' ? 'Senado' : 'Câmara') as 'Senado' | 'Câmara',
    photo: p.foto ?? undefined,
    bio: '',
    stats: {
      totalVotes: 0,
      votesInFavor: 0,
      votesAgainst: 0,
      abstentions: 0,
      projectsPresented: 0,
      attendance: 0,
    },
  };
}

async function buscarTodos(casa: 'Câmara' | 'Senado'): Promise<Politician[]> {
  const todos: Politician[] = [];
  let pagina = 1;
  const porPagina = 100;

  while (true) {
    const res = await politiciansService.listar({ casa, pagina, por_pagina: porPagina });
    const resultados = res.resultados ?? [];
    todos.push(...resultados.map(mapearPolitico));
    if (resultados.length < porPagina) break;
    pagina += 1;
  }

  return todos;
}

export default function SearchTab() {
  const router = useRouter();
  const {
    isGuest,
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    toggleSavePolitician,
    showToastMsg,
  } = useApp();

  const [politicians, setPoliticians] = useState<Politician[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const [deputados, senadores] = await Promise.all([
          buscarTodos('Câmara'),
          buscarTodos('Senado'),
        ]);
        setPoliticians([...deputados, ...senadores]);
      } catch {
        showToastMsg('Erro ao carregar parlamentares.');
      }
    }
    carregar();
  }, []);

  return (
    <SearchScreen
      politicians={politicians}
      savedProjects={savedProjects}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) { showToastMsg('Faça login para salvar.'); return; }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onToggleSavePolitician={(id) => {
        if (isGuest) { showToastMsg('Faça login para seguir parlamentares.'); return; }
        toggleSavePolitician(id);
      }}
    />
  );
}