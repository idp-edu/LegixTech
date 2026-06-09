import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { HomeFeed } from '@/components/HomeFeed';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
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
      .listar({ por_pagina: 20 })
      .then((res) => {
        const mapped: UiProject[] = (res.dados ?? []).map((p: any) => ({
          id: String(p.external_id ?? p.id),
          title: p.ementa ?? p.titulo ?? 'Sem título',
          year: String(p.ano ?? new Date().getFullYear()),
          status: mapSituacao(p.situacao),
          category: p.tipo ?? 'Projeto',
          summary: p.resumo ?? p.ementa ?? '',
          sponsor: p.autor ?? '',
          themes: p.temas ?? [],
          ods: (p.ods ?? []).map((o: any) => (typeof o === 'object' ? o.numero : o)),
        }));
        setProjects(mapped);
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

function mapSituacao(situacao?: string): 'active' | 'pending' | 'archived' | 'approved' {
  if (!situacao) return 'pending';
  const s = situacao.toLowerCase();
  if (s.includes('aprovad') || s.includes('sancion')) return 'approved';
  if (s.includes('arquivad')) return 'archived';
  if (s.includes('vota') || s.includes('pauta') || s.includes('tramit')) return 'pending';
  return 'active';
}