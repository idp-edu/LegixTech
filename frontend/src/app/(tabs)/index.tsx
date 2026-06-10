import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { HomeFeed } from '@/components/HomeFeed';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { mapApiListToUiList } from '@/mappers/projectMapper';  // ← usa o mapper centralizado
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
    recentProjects,          // ← adicionado
    toggleSaveProject,
    isDark,
    toggleTheme,
    setShowDigestStories,
    showToastMsg,
  } = useApp();

  const [projects, setProjects] = useState<UiProject[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    projectsService
      .listar({ por_pagina: 100 })           // ← era 20, agora 100 (consistente com busca)
      .then((res) => {
        setProjects(mapApiListToUiList(res.dados ?? []));  // ← mapper centralizado
      })
      .catch(() => showToastMsg('Erro ao carregar projetos.'));

    api
      .get<DailySummary>('/daily-summary/')
      .then(setDailySummary)
      .catch(() => {});
  }, []);

  return (
    <HomeFeed
      projects={projects}
      savedProjects={savedProjects}
      recentProjects={recentProjects}        // ← adicionado
      dailySummary={dailySummary}
      onProjectClick={(id) => router.push(`/project/${id}` as never)}
      onToggleSave={(id) => {
        if (isGuest) {
          showToastMsg('Faça login para salvar projetos.');
          return;
        }
        toggleSaveProject(id);
      }}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      onDigestClick={() => setShowDigestStories(true)}
    />
  );
}