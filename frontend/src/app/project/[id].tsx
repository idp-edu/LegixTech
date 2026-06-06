import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { ProjectDetail } from '@/components/ProjectDetail';
import { useApp } from '@/context/AppContext';
import { mockProjects } from '@/data/mockProjects';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isGuest, openChatbot, showToastMsg } = useApp();

  const projectId = Array.isArray(id) ? id[0] : id;

  const project = mockProjects.find(
    (p) =>
      String(p.id ?? '') === String(projectId ?? '') ||
      String(p.externalId ?? '') === String(projectId ?? ''),
  );

  if (!project) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-4 text-center text-foreground">
          Projeto não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <ProjectDetail
      project={project}
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