import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';

import { ProjectDetail } from '@/components/ProjectDetail';
import { useApp } from '@/context/AppContext';
import { useProject } from '@/hooks/useProject';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isGuest, openChatbot, showToastMsg, savedProjects, toggleSaveProject, addRecentProject } = useApp();

  const projectId = Array.isArray(id) ? id[0] : id;
  const { project, loading, error } = useProject(projectId);

  // Registra no histórico quando o projeto carrega
  const hasRegistered = React.useRef(false);
  if (project && !hasRegistered.current) {
    hasRegistered.current = true;
    addRecentProject(project.id);
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
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
      saved={savedProjects.includes(project.id)}
      onSave={() => toggleSaveProject(project.id)}
      onBack={() => router.back()}
      onChatbotClick={() => {
        if (isGuest) {
          showToastMsg('Faça login para usar o assistente deste projeto.');
          return;
        }
        openChatbot('projeto de lei');
      }}
    />
  );
}
