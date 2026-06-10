import { Bell, Moon, Sun } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import type { UiProject } from '@/types/project';

import { DailyDigestCard } from './DailyDigestCard';
import { ProjectCard } from './ProjectCard';

interface DailySummary {
  data: string;
  destaques: string[];
  estatisticas: {
    em_tramitacao: number;
    aguardando_votacao: number;
    aprovados: number;
  };
}

interface HomeFeedProps {
  projects: UiProject[];
  savedProjects: string[];
  recentProjects: string[];
  dailySummary?: DailySummary | null;
  onProjectClick: (id: string) => void;
  onToggleSave: (id: string) => void;
  onKpiClick?: (filter: 'active' | 'pending' | 'approved') => void; // ← novo
  isDark: boolean;
  onToggleTheme: () => void;
  onDigestClick?: () => void;
}

// ─── Skeleton de card ─────────────────────────────────────────────────────────

function ProjectCardSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={{ borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, gap: 12 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ height: 24, width: 80, borderRadius: 8, backgroundColor: colors.border, opacity: 0.6 }} />
        <View style={{ height: 24, width: 60, borderRadius: 8, backgroundColor: colors.border, opacity: 0.6 }} />
      </View>
      <View style={{ height: 18, width: '90%', borderRadius: 8, backgroundColor: colors.border, opacity: 0.6 }} />
      <View style={{ height: 18, width: '65%', borderRadius: 8, backgroundColor: colors.border, opacity: 0.6 }} />
      <View style={{ height: 14, width: '80%', borderRadius: 8, backgroundColor: colors.border, opacity: 0.4 }} />
    </View>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function HomeFeed({
  projects,
  savedProjects,
  recentProjects,
  dailySummary,
  onProjectClick,
  onToggleSave,
  onKpiClick,
  isDark,
  onToggleTheme,
  onDigestClick,
}: HomeFeedProps) {
  const { colors } = useTheme();

  const stats = dailySummary?.estatisticas;
  const emTramitacao = stats?.em_tramitacao ?? 0;
  const aguardandoVotacao = stats?.aguardando_votacao ?? 0;
  const aprovados = stats?.aprovados ?? 0;

  const isLoading = projects.length === 0;

  const recentList = recentProjects
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is UiProject => p !== undefined);

  const recentIds = new Set(recentProjects);
  const generalList = projects.filter((p) => !recentIds.has(p.id));

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
              {isDark ? <Sun size={20} color={colors.text} /> : <Moon size={20} color={colors.text} />}
            </Pressable>
            <Pressable
              style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
            >
              <Bell size={20} color={colors.text} />
              <View style={{ position: 'absolute', right: 8, top: 8, height: 8, width: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
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
            <DailyDigestCard onClick={onDigestClick} dailySummary={dailySummary ?? undefined} />
          </View>
        )}

        {/* ── KPI cards clicáveis ───────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
          <Pressable
            onPress={() => onKpiClick?.('active')}
            style={{ flex: 1, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.kpiGreenText, backgroundColor: colors.kpiGreenBg, padding: 16 }}
          >
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.kpiGreenText, marginBottom: 4 }}>
              {emTramitacao}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.kpiGreenText, textAlign: 'center' }}>
              Em Tramitação
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onKpiClick?.('pending')}
            style={{ flex: 1, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.kpiAmberText, backgroundColor: colors.kpiAmberBg, padding: 16 }}
          >
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.kpiAmberText, marginBottom: 4 }}>
              {aguardandoVotacao}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.kpiAmberText, textAlign: 'center' }}>
              Aguardando{'\n'}Votação
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onKpiClick?.('approved')}
            style={{ flex: 1, alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: colors.kpiBlueText, backgroundColor: colors.kpiBlueBg, padding: 16 }}
          >
            <Text style={{ fontSize: 28, fontWeight: 'bold', color: colors.kpiBlueText, marginBottom: 4 }}>
              {aprovados}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.kpiBlueText, textAlign: 'center' }}>
              Aprovados
            </Text>
          </Pressable>
        </View>

        {/* ── Atividade Recente ─────────────────────────────────────────── */}
        {recentList.length > 0 && (
          <>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
              Atividade Recente
            </Text>
            {recentList.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
                saved={savedProjects.includes(project.id)}
                onClick={onProjectClick}
                onSave={onToggleSave}
              />
            ))}
          </>
        )}

        {/* ── Lista geral / Skeleton ────────────────────────────────────── */}
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
          {recentList.length > 0 ? 'Em Destaque' : 'Atividade Recente'}
        </Text>

        {isLoading ? (
          <>
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </>
        ) : (
          generalList.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              saved={savedProjects.includes(project.id)}
              onClick={onProjectClick}
              onSave={onToggleSave}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}