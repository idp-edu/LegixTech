import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Share2,
  Users,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getODSColorByNumber } from '@/data/odsMapping';
import type { UiProject } from '@/types/project';

import { StatusBadge } from './StatusBadge';

interface ProjectDetailProps {
  project: UiProject;
  onBack: () => void;
  onChatbotClick?: () => void;
}

export function ProjectDetail({ project, onBack, onChatbotClick }: ProjectDetailProps) {
  const firstOds = project.ods?.[0];

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={['top']} className="border-b border-border bg-card px-4 py-4">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onBack} className="min-h-11 min-w-11 items-center justify-center -ml-2 rounded-full">
            <ArrowLeft size={24} color="#1a1a1a" />
          </Pressable>
          <Text className="flex-1 font-display text-lg font-bold text-foreground">Detalhes do Projeto</Text>
          <Pressable className="min-h-11 min-w-11 items-center justify-center rounded-full">
            <Share2 size={20} color="#1e40af" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ paddingBottom: 112, gap: 24 }}>
        <View className="gap-3">
          <View className="flex-row flex-wrap items-center gap-2">
            <StatusBadge status={project.status ?? 'pending'} />
            {firstOds ? (
              <Text
                className="rounded px-3 py-1 text-sm font-medium"
                style={{
                  backgroundColor: getODSColorByNumber(firstOds, true),
                  color: getODSColorByNumber(firstOds, false),
                  borderWidth: 1,
                  borderColor: getODSColorByNumber(firstOds, false),
                }}
              >
                ODS {firstOds}
              </Text>
            ) : null}
          </View>
          <Text className="font-display text-2xl font-bold text-foreground">{project.title}</Text>
        </View>

        <View className="flex-row flex-wrap gap-4 rounded-lg border border-border bg-surface p-4">
          <View className="min-w-[45%] flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Building2 size={16} color="#6b7280" />
              <Text className="text-sm text-muted-foreground">Autor</Text>
            </View>
            <Text className="text-sm font-medium text-foreground">{project.sponsor ?? 'Não informado'}</Text>
          </View>
          <View className="min-w-[45%] flex-1 gap-1">
            <View className="flex-row items-center gap-2">
              <Calendar size={16} color="#6b7280" />
              <Text className="text-sm text-muted-foreground">Ano</Text>
            </View>
            <Text className="text-sm font-medium text-foreground">{project.year ?? 'Não informado'}</Text>
          </View>
        </View>

        <View className="border-b border-border pb-1">
          <Text className="font-medium text-primary">Entenda a Lei</Text>
          <View className="mt-2 h-0.5 w-full bg-primary" />
        </View>

        <View className="gap-3">
          <Text className="font-display text-lg font-bold text-foreground">O Resumo</Text>
          <Text className="leading-relaxed text-foreground">
            {project.summary ?? 'Resumo não disponível para este projeto.'}
          </Text>
          <Text className="text-xs italic text-muted-foreground">Resumo exibido a partir dos dados da API</Text>
        </View>

        {project.themes?.length ? (
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Users size={20} color="#1e40af" />
              <Text className="font-display text-lg font-bold text-foreground">Temas relacionados</Text>
            </View>
            {project.themes.map((theme, index) => (
              <View key={`${theme}-${index}`} className="flex-row items-start gap-3 rounded-lg bg-surface p-3">
                <View className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <Text className="flex-1 leading-relaxed text-foreground">{theme}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="gap-3">
          <Text className="font-display text-lg font-bold text-foreground">Linha do Tempo do Projeto</Text>
          <View className="gap-4 rounded-lg border border-border bg-surface p-4">
            <View className="flex-row gap-4">
              <View className="items-center">
                <View className="h-3 w-3 rounded-full bg-primary" />
                <View className="mt-1 w-0.5 flex-1 bg-border" style={{ minHeight: 40 }} />
              </View>
              <View className="flex-1 pb-2">
                <Text className="text-sm text-muted-foreground">{project.year ?? 'Ano não informado'}</Text>
                <Text className="font-medium text-foreground">Projeto apresentado</Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  Apresentado por {project.sponsor ?? 'autor não informado'}
                </Text>
              </View>
            </View>

            {project.status === 'approved' && (
              <View className="flex-row gap-4">
                <CheckCircle size={16} color="#15803d" style={{ marginTop: 4 }} />
                <View className="flex-1">
                  <Text className="font-medium text-success">Aprovado</Text>
                </View>
              </View>
            )}

            {project.status === 'active' && (
              <View className="flex-row gap-4">
                <View className="h-3 w-3 rounded-full bg-warning" style={{ marginTop: 4 }} />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">Atual</Text>
                  <Text className="font-medium text-foreground">Em análise na comissão</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <Pressable className="min-h-[52px] flex-row items-center justify-center gap-2 rounded-lg bg-primary py-4">
          <ExternalLink size={20} color="#fff" />
          <Text className="font-medium text-primary-foreground">Acessar Texto Oficial</Text>
        </Pressable>
      </ScrollView>

      {onChatbotClick && (
        <Pressable
          onPress={onChatbotClick}
          className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg"
        >
          <MessageCircle size={24} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}