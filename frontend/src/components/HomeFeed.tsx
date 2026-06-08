import { Bell, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Project, ProjectStatus } from '@/types/project';

import { DailyDigestCard } from './DailyDigestCard';
import { ProjectCard } from './ProjectCard';

interface HomeFeedProps {
  projects: Project[];
  savedProjects: string[];
  onProjectClick: (id: string) => void;
  onToggleSave: (id: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onDigestClick?: () => void;
}

export function HomeFeed({
  projects,
  savedProjects,
  onProjectClick,
  onToggleSave,
  isDark,
  onToggleTheme,
  onDigestClick,
}: HomeFeedProps) {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="border-b border-border bg-card px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="mb-1 font-display text-2xl font-bold text-foreground">LegixTech</Text>
            <Text className="text-sm text-muted-foreground">Monitoramento Legislativo</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Pressable onPress={onToggleTheme} className="min-h-11 min-w-11 items-center justify-center rounded-full">
              {isDark ? <Sun size={20} color="#1a1a1a" /> : <Moon size={20} color="#1a1a1a" />}
            </Pressable>
            <Pressable className="relative min-h-11 min-w-11 items-center justify-center rounded-full">
              <Bell size={20} color="#1a1a1a" />
              <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 96, gap: 16 }}>
        {onDigestClick && (
          <View className="mb-2">
            <DailyDigestCard onClick={onDigestClick} />
          </View>
        )}

        <View className="mb-2 flex-row gap-3">
          <View className="flex-1 items-center rounded-lg border border-success bg-success-light p-4">
            <Text className="mb-1 font-display text-2xl font-bold text-success">24</Text>
            <Text className="text-xs font-medium text-success">Em Tramitação</Text>
          </View>
          <View className="flex-1 items-center rounded-lg border border-warning bg-warning-light p-4">
            <Text className="mb-1 font-display text-2xl font-bold text-warning">12</Text>
            <Text className="text-xs font-medium text-warning">Aguardando Votação</Text>
          </View>
          <View className="flex-1 items-center rounded-lg border border-info bg-info-light p-4">
            <Text className="mb-1 font-display text-2xl font-bold text-info">8</Text>
            <Text className="text-xs font-medium text-info">Aprovados</Text>
          </View>
        </View>

        <Text className="font-display text-lg font-bold text-foreground">Atividade Recente</Text>
        {projects.map((project) => (
          <ProjectCard
            key={project.id ?? project.externalId}
            id={String(project.id ?? project.externalId ?? '')}
            title={project.title}
            year={String(project.year ?? '')}
            status={(project.status ?? 'pending') as ProjectStatus}
            trending={false}
            category={project.source ?? project.type ?? 'Projeto'}
            saved={savedProjects.includes(String(project.id ?? project.externalId ?? ''))}
            onClick={onProjectClick}
            onSave={onToggleSave}
          />
        ))}
      </ScrollView>
    </View>
  );
}