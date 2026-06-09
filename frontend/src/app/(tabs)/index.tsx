import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { HomeFeed } from '@/components/HomeFeed';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { api } from '@/services/api';
import type { Project } from '@/types/project';

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
    toggleSaveProject,
    isDark,
    toggleTheme,
    setShowDigestStories,
    showToastMsg,
  } = useApp();

  const [projects, setProjects] = useState<Project[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);

  useEffect(() => {
    // Busca projetos
    projectsService
      .listar({ por_pagina: 20 })
      .then((res) => {
        const mapped: Project[] = (res.dados ?? []).map((p: any) => ({
          id: String(p.external_id ?? p.id),
          externalId: String(p.external_id ?? p.id),
          title: p.ementa ?? p.titulo ?? 'Sem título',
          year: p.ano ?? new Date().getFullYear(),
          status: mapSituacao(p.situacao),
          source: p.tipo ?? 'Projeto',
          type: p.tipo ?? '',
        }));
        setProjects(mapped);
      })
      .catch(() => showToastMsg('Erro ao carregar projetos.'));

    // Busca resumo do dia
    api
      .get<DailySummary>('/daily-summary/')
      .then(setDailySummary)
      .catch(() => {});
  }, []);

  return (
    <HomeFeed
      projects={projects}
      savedProjects={savedProjects}
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

function mapSituacao(situacao?: string): string {
  if (!situacao) return 'pending';
  const s = situacao.toLowerCase();
  if (s.includes('aprovad') || s.includes('sancion')) return 'approved';
  if (s.includes('vota') || s.includes('pauta')) return 'voting';
  if (s.includes('tramit') || s.includes('comiss')) return 'active';
  return 'pending';
}
