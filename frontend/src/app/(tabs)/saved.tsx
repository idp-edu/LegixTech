import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { SavedProjects } from '@/components/SavedProjects';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { politiciansService } from '@/services/politiciansService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import type { UiProject } from '@/types/project';
import type { Politician } from '@/data/mockPoliticians';

export default function SavedTab() {
  const router = useRouter();
  const {
    isGuest,
    savedProjects,
    savedPoliticians,
    toggleSaveProject,
    removePolitician,
    showToastMsg,
  } = useApp();

  const [allProjects, setAllProjects] = useState<UiProject[]>([]);
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, lista] = await Promise.all([
        projectsService.listar({ por_pagina: 100 }),
        politiciansService.getSeguindo(),
      ]);

      setAllProjects(mapApiListToUiList(res.dados ?? []));

      setPoliticians(
        lista.map((p) => ({
          id: String(p.politician_id),
          name: p.politician_name ?? 'Parlamentar',
          party: p.politician_party ?? '',
          state: p.politician_state ?? '',
          house: 'Câmara' as const,
          photo: p.politician_photo_url ?? undefined,
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
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar salvos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  if (loading) return <LoadingState message="Carregando salvos..." />;
  if (error) return <ErrorState message={error} onRetry={carregar} />;

  const projects = allProjects.filter((p) => savedProjects.includes(p.id));
  const requireLogin = () => showToastMsg('Faça login para acessar e gerenciar seus itens salvos.');

  return (
    <SavedProjects
      projects={projects}
      politicians={politicians}
      savedPoliticians={savedPoliticians}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) { requireLogin(); return; }
        toggleSaveProject(id);
      }}
      onPoliticianClick={(id) => router.push(`/politician/${id}` as never)}
      onRemovePolitician={(id) => {
        if (isGuest) { requireLogin(); return; }
        removePolitician(id);
      }}
      onNavigateToSearch={() => router.push('/(tabs)/search' as never)}
      onShowToast={showToastMsg}
    />
  );
}