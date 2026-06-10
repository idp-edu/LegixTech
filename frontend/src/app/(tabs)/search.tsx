import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { SearchScreen } from '@/components/SearchScreen';
import { useApp } from '@/context/AppContext';
import { politiciansService } from '@/services/politiciansService';
import type { Politician } from '@/data/mockPoliticians';

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
    politiciansService
      .listar({ por_pagina: 100 })
      .then((res) =>
        setPoliticians(
          (res.resultados ?? []).map((p: any) => ({
            id: p.external_id ?? String(p.id),
            name: p.nome,
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
          })),
        ),
      )
      .catch(() => showToastMsg('Erro ao carregar parlamentares.'));
  }, []);

  return (
    <SearchScreen
      politicians={politicians}
      savedProjects={savedProjects}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) {
          showToastMsg('Faça login para salvar.');
          return;
        }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onToggleSavePolitician={(id) => {
        if (isGuest) {
          showToastMsg('Faça login para seguir parlamentares.');
          return;
        }
        toggleSavePolitician(id);
      }}
    />
  );
}