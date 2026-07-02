import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { ProjectDetail } from '@/components/ProjectDetail';
import { useApp } from '@/context/AppContext';
import { projectsService } from '@/services/projectsService';
import { mapApiProjectToUiProject } from '@/mappers/projectMapper';
import type { UiProject, TimelineEvent } from '@/types/project';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isGuest, openChatbot, showToastMsg, savedProjects, toggleSaveProject, addRecentProject } = useApp();

  const projectId = Array.isArray(id) ? id[0] : id;

  const [project, setProject] = useState<UiProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    setError(null);

    Promise.all([
      projectsService.detalhar(projectId),
      projectsService.tramitacao(projectId).catch(() => ({ estagio_atual: 1, estagios: [], historico: [] })),
    ])
      .then(([data, tramData]) => {
        const uiProject = mapApiProjectToUiProject(data);

        const timeline: TimelineEvent[] = tramData.historico.map((t) => ({
          date: t.dataHora ?? '',
          label: t.situacao ?? t.despacho ?? '',
        }));

        setProject({ ...uiProject, timeline });
      })
      .catch(() => setError('Não foi possível carregar o projeto.'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const hasRegistered = React.useRef(false);
  if (project && !hasRegistered.current) {
    hasRegistered.current = true;
    addRecentProject(project.id);
  }

  if (!loading && (error || !project)) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-4 text-center text-foreground">
          {error ?? 'Projeto não encontrado.'}
        </Text>
        <Text className="text-primary" onPress={() => router.back()}>
          Voltar
        </Text>
      </View>
    );
  }

  return (
    <ProjectDetail
      project={project}
      loading={loading}
      saved={project ? savedProjects.includes(project.id) : false}
      onSave={() => project && toggleSaveProject(project.id)}
      onBack={() => router.back()}
      onChatbotClick={() => {
        if (isGuest) {
          showToastMsg('Faça login para usar o assistente deste projeto.');
          return;
        }
        openChatbot(project?.title ?? 'projeto de lei');
      }}
    />
  );
}