import { useLocalSearchParams, useRouter } from 'expo-router';

import { ProjectDetail } from '@/components/ProjectDetail';
import { useApp } from '@/context/AppContext';
import { mockProjects } from '@/data/mockProjects';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { userType, openChatbot } = useApp();

  const project = mockProjects.find((p) => p.id === id);
  if (!project) {
    router.back();
    return null;
  }

  return (
    <ProjectDetail
      project={project}
      onBack={() => router.back()}
      onChatbotClick={userType !== 'guest' ? () => openChatbot('projeto de lei') : undefined}
    />
  );
}
