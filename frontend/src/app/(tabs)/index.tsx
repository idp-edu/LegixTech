import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { HomeFeed } from '@/components/HomeFeed';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';
import { api } from '@/services/api';
import type { UiProject } from '@/types/project';

interface DailySummary {
  data: string;
  destaques: string[];
  estatisticas: {
    em_tramitacao: number;
    aguardando_votacao: number;
    aprovados: number;
  };
}

export default function HomeTab() {
  const router = useRouter();
  const {
    isGuest,
    savedProjects,
    recentProjects,
    toggleSaveProject,
    isDark,
    toggleTheme,
    setShowDigestStories,
    showToastMsg,
  } = useApp();

  const [projects, setProjects] = useState<UiProject[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [res, summary] = await Promise.all([
        projectsService.listar({ por_pagina: 100 }),
        api.get<DailySummary>('/daily-summary/').catch(() => null),
      ]);
      setProjects(mapApiListToUiList(res.dados ?? []));
      if (summary) setDailySummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (loading) return <LoadingState message="Carregando projetos..." />;
  if (error) return <ErrorState message={error} onRetry={carregar} />;

  return (
    <HomeFeed
      projects={projects}
      savedProjects={savedProjects}
      recentProjects={recentProjects}
      dailySummary={dailySummary}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) { showToastMsg('Faça login para salvar projetos.'); return; }
        toggleSaveProject(id);
      }}
      onKpiClick={() => router.push('/(tabs)/search' as never)}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      onDigestClick={() => setShowDigestStories(true)}
    />
  );
}