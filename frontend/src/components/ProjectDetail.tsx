import {
  ArrowLeft,
  Bot,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageCircle,
  Share2,
  Users,
  Bookmark,
} from 'lucide-react-native';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/useTheme';
import { getODSColorByNumber } from '@/data/odsMapping';
import type { UiProject } from '@/types/project';
import { StatusBadge } from './StatusBadge';

interface ProjectDetailProps {
  project: UiProject | null;
  loading?: boolean;
  onBack: () => void;
  onChatbotClick?: () => void;
  saved?: boolean;
  onSave?: () => void;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonBar({ width, height = 16 }: { width: string | number; height?: number }) {
  const { colors } = useTheme();
  return (
    <View style={{ height, width: width as any, borderRadius: 8, backgroundColor: colors.border, opacity: 0.6 }} />
  );
}

function ProjectDetailSkeleton() {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 16 }}
      contentContainerStyle={{ paddingTop: 24, paddingBottom: 112, gap: 24 }}
    >
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <SkeletonBar width={80} height={24} />
          <SkeletonBar width={60} height={24} />
        </View>
        <SkeletonBar width="90%" height={28} />
        <SkeletonBar width="60%" height={28} />
      </View>

      <View style={{ borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, gap: 12 }}>
        <SkeletonBar width="50%" />
        <SkeletonBar width="70%" />
        <SkeletonBar width="40%" />
        <SkeletonBar width="55%" />
      </View>

      <View style={{ gap: 12 }}>
        <SkeletonBar width={120} height={22} />
        <SkeletonBar width="100%" />
        <SkeletonBar width="100%" />
        <SkeletonBar width="80%" />
      </View>

      <View style={{ borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16, gap: 16 }}>
        <SkeletonBar width={160} height={22} />
        {[1, 2].map((i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 16 }}>
            <SkeletonBar width={12} height={12} />
            <View style={{ flex: 1, gap: 8 }}>
              <SkeletonBar width="40%" />
              <SkeletonBar width="70%" />
            </View>
          </View>
        ))}
      </View>

      <SkeletonBar width="100%" height={52} />
    </ScrollView>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export function ProjectDetail({
  project,
  loading = false,
  onBack,
  onChatbotClick,
  saved,
  onSave,
}: ProjectDetailProps) {
  const { colors } = useTheme();

  const handleOpenOfficialUrl = () => {
    if (project?.officialUrl) {
      Linking.openURL(project.officialUrl).catch(() => {});
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={onBack}
            style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -8, borderRadius: 22 }}
          >
            <ArrowLeft size={24} color={colors.text} />
          </Pressable>

          <Text style={{ flex: 1, fontSize: 18, fontWeight: 'bold', color: colors.text }}>
            Detalhes do Projeto
          </Text>

          {onSave && (
            <Pressable
              onPress={onSave}
              style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}
            >
              <Bookmark
                size={20}
                color={saved ? colors.primary : colors.textMuted}
                fill={saved ? colors.primary : 'none'}
              />
            </Pressable>
          )}

          <Pressable style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}>
            <Share2 size={20} color={colors.primary} />
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Skeleton enquanto carrega */}
      {loading || !project ? (
        <ProjectDetailSkeleton />
      ) : (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 16 }}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 112, gap: 24 }}
        >
          {/* Status + título */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <StatusBadge status={project.status ?? 'pending'} />
              {project.ods?.[0] ? (
                <Text
                  style={{
                    borderRadius: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    fontSize: 14,
                    fontWeight: '500',
                    backgroundColor: getODSColorByNumber(project.ods[0], true),
                    color: getODSColorByNumber(project.ods[0], false),
                    borderWidth: 1,
                    borderColor: getODSColorByNumber(project.ods[0], false),
                  }}
                >
                  ODS {project.ods[0]}
                </Text>
              ) : null}
            </View>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.text }}>
              {project.title}
            </Text>
          </View>

          {/* Autor e ano */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }}>
            <View style={{ minWidth: '45%', flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Building2 size={16} color={colors.textMuted} />
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Autor</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
                {project.sponsor || 'Não informado'}
              </Text>
            </View>
            <View style={{ minWidth: '45%', flex: 1, gap: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color={colors.textMuted} />
                <Text style={{ fontSize: 14, color: colors.textMuted }}>Ano</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>
                {project.year || 'Não informado'}
              </Text>
            </View>
          </View>

          {/* Separador */}
          <View style={{ borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 4 }}>
            <Text style={{ fontWeight: '500', color: colors.primary }}>Entenda a Lei</Text>
            <View style={{ marginTop: 8, height: 2, width: '100%', backgroundColor: colors.primary }} />
          </View>

          {/* Resumo */}
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>O Resumo</Text>
            <Text style={{ lineHeight: 24, color: colors.text }}>
              {project.summary || 'Resumo não disponível para este projeto.'}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Bot size={13} color={colors.textMuted} />
              <Text style={{ fontSize: 12, fontStyle: 'italic', color: colors.textMuted }}>
                Resumo gerado com auxílio de IA
              </Text>
            </View>
          </View>

          {/* Temas */}
          {project.themes?.length ? (
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Users size={20} color={colors.primary} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                  Temas relacionados
                </Text>
              </View>
              {project.themes.map((theme, index) => (
                <View
                  key={`${theme}-${index}`}
                  style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 8, backgroundColor: colors.surface, padding: 12 }}
                >
                  <View style={{ marginTop: 8, height: 6, width: 6, borderRadius: 3, backgroundColor: colors.primary }} />
                  <Text style={{ flex: 1, lineHeight: 24, color: colors.text }}>{theme}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* ── Timeline dinâmica ──────────────────────────────────────────── */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Clock size={20} color={colors.primary} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>
                Linha do Tempo
              </Text>
            </View>

            <View style={{ gap: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: 16 }}>
              {project.timeline && project.timeline.length > 0 ? (
                // Dados reais vindos do projectMapper (tramitacoes + data_apresentacao)
                project.timeline.map((event, index) => {
                  const isLast = index === project.timeline!.length - 1;
                  return (
                    <View key={index} style={{ flexDirection: 'row', gap: 16 }}>
                      <View style={{ alignItems: 'center' }}>
                        <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: isLast ? colors.primary : colors.border }} />
                        {!isLast && (
                          <View style={{ marginTop: 4, width: 2, flex: 1, backgroundColor: colors.border, minHeight: 32 }} />
                        )}
                      </View>
                      <View style={{ flex: 1, paddingBottom: isLast ? 0 : 8 }}>
                        <Text style={{ fontSize: 12, color: colors.textMuted }}>{event.date}</Text>
                        <Text style={{ fontWeight: '500', color: colors.text }}>{event.label}</Text>
                      </View>
                    </View>
                  );
                })
              ) : (
                // Fallback quando o backend não envia tramitações
                <>
                  <View style={{ flexDirection: 'row', gap: 16 }}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: colors.primary }} />
                      <View style={{ marginTop: 4, width: 2, flex: 1, backgroundColor: colors.border, minHeight: 40 }} />
                    </View>
                    <View style={{ flex: 1, paddingBottom: 8 }}>
                      <Text style={{ fontSize: 14, color: colors.textMuted }}>
                        {project.year || 'Ano não informado'}
                      </Text>
                      <Text style={{ fontWeight: '500', color: colors.text }}>Projeto apresentado</Text>
                      <Text style={{ marginTop: 4, fontSize: 14, color: colors.textMuted }}>
                        Apresentado por {project.sponsor || 'autor não informado'}
                      </Text>
                    </View>
                  </View>

                  {project.status === 'approved' && (
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <CheckCircle size={16} color="#15803d" style={{ marginTop: 4 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '500', color: '#15803d' }}>Aprovado</Text>
                      </View>
                    </View>
                  )}

                  {project.status === 'active' && (
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      <View style={{ height: 12, width: 12, borderRadius: 6, backgroundColor: colors.kpiAmberText, marginTop: 4 }} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, color: colors.textMuted }}>Atual</Text>
                        <Text style={{ fontWeight: '500', color: colors.text }}>Em análise na comissão</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* ── Botão Texto Oficial ────────────────────────────────────────── */}
          <Pressable
            onPress={handleOpenOfficialUrl}
            disabled={!project.officialUrl}
            style={{
              minHeight: 52,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 8,
              paddingVertical: 16,
              backgroundColor: project.officialUrl ? colors.primary : colors.border,
              opacity: project.officialUrl ? 1 : 0.6,
            }}
          >
            <ExternalLink size={20} color="#fff" />
            <Text style={{ fontWeight: '500', color: '#fff' }}>
              {project.officialUrl ? 'Acessar Texto Oficial' : 'Texto oficial indisponível'}
            </Text>
          </Pressable>
        </ScrollView>
      )}

      {/* FAB chatbot */}
      {onChatbotClick && (
        <Pressable
          onPress={onChatbotClick}
          style={{
            position: 'absolute',
            bottom: 32,
            right: 24,
            height: 56,
            width: 56,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 28,
            backgroundColor: colors.primary,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <MessageCircle size={24} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}