import { useRouter } from 'expo-router';

import { HomeFeed } from '@/components/HomeFeed';
import { useApp } from '@/context/AppContext';
import { mockProjects } from '@/data/mockProjects';

export default function HomeTab() {
  const router = useRouter();
  const { savedProjects, toggleSaveProject, isDark, toggleTheme, setShowDigestStories } = useApp();

  return (
    <HomeFeed
      projects={mockProjects}
      savedProjects={savedProjects}
      onProjectClick={(id) => router.push(`/project/${id}`)}
      onToggleSave={toggleSaveProject}
      isDark={isDark}
      onToggleTheme={toggleTheme}
      onDigestClick={() => setShowDigestStories(true)}
    />
  );
}
