import { useRouter } from 'expo-router';

import { HomeFeed } from '@/components/HomeFeed';
import { useApp } from '@/context/AppContext';
import { mockProjects } from '@/data/mockProjects';

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

  return (
    <HomeFeed
      projects={mockProjects}
      savedProjects={savedProjects}
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