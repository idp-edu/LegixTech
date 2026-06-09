import { Bell, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
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
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView
        edges={['top']}
        style={{
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
          backgroundColor: colors.surface,
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 2 }}>
              LegixTech
            </Text>
            <Text style={{ fontSize: 14, color: colors.textMuted }}>Monitoramento Legislativo</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable
              onPress={onToggleTheme}
              style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
            >
              {isDark ? (
                <Sun size={20} color={colors.text} />
              ) : (
                <Moon size={20} color={colors.text} />
              )}
            </Pressable>
            <Pressable
              style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
            >
              <Bell size={20} color={colors.text} />
              <View
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: '#EF4444',
                }}
              />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        contentContainerStyle={{ paddingTop: 24, paddingBottom: 96, gap: 16 }}
      >
        {onDigestClick && (
          <View style={{ marginBottom: 8 }}>
            <DailyDigestCard onClick={onDigestClick} />
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
          <View style={{ flex: 1, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.kpiGreenText, backgroundColor: colors.kpiGreenBg, padding: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.kpiGreenText, marginBottom: 4 }}>24</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.kpiGreenText, textAlign: 'center' }}>Em Tramitação</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.kpiAmberText, backgroundColor: colors.kpiAmberBg, padding: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.kpiAmberText, marginBottom: 4 }}>12</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.kpiAmberText, textAlign: 'center' }}>Aguardando Votação</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.kpiBlueText, backgroundColor: colors.kpiBlueBg, padding: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.kpiBlueText, marginBottom: 4 }}>8</Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.kpiBlueText, textAlign: 'center' }}>Aprovados</Text>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>Atividade Recente</Text>

        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title}
            year={project.year}
            status={project.status as ProjectStatus}
            trending={false}
            category={project.category}
            ementa={(project as any).ementa}
            ods={(project as any).ods?.map((o: any) => typeof o === 'object' ? o.numero : o)}
            temas={(project as any).temas}
            saved={savedProjects.includes(project.id)}
            onClick={onProjectClick}
            onSave={onToggleSave}
          />
        ))}
      </ScrollView>
    </View>
  );
}