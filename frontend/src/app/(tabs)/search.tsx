import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { SearchScreen } from '@/components/SearchScreen';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { politiciansService } from '@/services/politiciansService';
import type { Politician } from '@/data/mockPoliticians';
import type { ProjectStatus } from '@/types/project';

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

  const [projects, setProjects] = useState<
    Array<{ id: string; title: string; year: string; status: ProjectStatus; category: string }>
  >([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);

  useEffect(() => {
    projectsService
      .listar({ por_pagina: 50 })
      .then((res) =>
        setProjects(
          (res.dados ?? []).map((p: any) => ({
            id: String(p.external_id ?? p.id),
            title: p.ementa ?? p.titulo ?? 'Sem título',
            year: String(p.ano ?? ''),
            status: 'pending' as ProjectStatus,
            category: p.tipo ?? 'Projeto',
          })),
        ),
      )
      .catch(() => showToastMsg('Erro ao carregar projetos.'));

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
      projects={projects}
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
