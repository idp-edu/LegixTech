import { Bookmark, Calendar, TrendingUp } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { getODSByNumber, getODSColor, getODSColorByNumber } from '@/data/odsMapping';
import { useTheme } from '@/hooks/useTheme';
import type { ProjectStatus } from '@/types/project';

import { StatusBadge } from './StatusBadge';

interface ProjectCardProps {
  id: string;
  title: string;        // código técnico: "PL 4476"
  headline?: string;    // ← NOVO: manchete legível
  ementa?: string;      // ← NOVO: ementa completa (usada como fallback)
  year: string;
  status: ProjectStatus;
  trending?: boolean;
  category: string;
  ods?: number[];
  temas?: string[];
  saved?: boolean;
  canSave?: boolean;
  onSave?: (id: string) => void;
  onClick?: (id: string) => void;
  onRequireAuth?: () => void;
}

function truncate(text: string, max = 120): string {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '...';
}

export function ProjectCard({
  id,
  title,
  headline,
  ementa,
  year,
  status,
  trending,
  category,
  ods,
  temas,
  saved,
  canSave = true,
  onSave,
  onClick,
  onRequireAuth,
}: ProjectCardProps) {
  const { colors } = useTheme();
  const primeiroOds = ods?.[0];
  const primeiraTema = temas?.[0];

  // Título principal: usa headline se disponível, senão ementa truncada, senão código
  const displayTitle = headline || (ementa ? truncate(ementa, 100) : title);

  return (
    <Pressable
      onPress={() => onClick?.(id)}
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: 16,
      }}
    >
      {/* Linha superior: status + trending + bookmark */}
      <View style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, flex: 1 }}>
          <StatusBadge status={status} size="sm" />
          {trending && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: colors.badgeEmAltaBg,
              }}
            >
              <TrendingUp size={12} color={colors.badgeEmAltaText} />
              <Text style={{ fontSize: 12, fontWeight: '500', color: colors.badgeEmAltaText }}>
                Em Alta
              </Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            if (!canSave) {
              onRequireAuth?.();
              return;
            }
            onSave?.(id);
          }}
          style={{ minHeight: 44, minWidth: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8, marginTop: -8 }}
          hitSlop={8}
        >
          <Bookmark
            size={20}
            color={saved ? colors.primary : colors.textMuted}
            fill={saved ? colors.primary : 'transparent'}
          />
        </Pressable>
      </View>

      {/* ← NOVO: Título tipo manchete em destaque */}
      <Text style={{ marginBottom: 4, fontSize: 16, fontWeight: '600', lineHeight: 22, color: colors.text }}>
        {displayTitle}
      </Text>

      {/* ← NOVO: Código técnico em posição secundária */}
      <Text style={{ marginBottom: 10, fontSize: 12, color: colors.textMuted }}>
        {title} · {year}
      </Text>

      {/* Linha inferior: tema + ODS */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>

        {/* Badge de tema */}
        {primeiraTema ? (
          <Text
            style={{
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              fontSize: 12,
              fontWeight: '500',
              backgroundColor: getODSColor(primeiraTema, true),
              color: getODSColor(primeiraTema, false),
              borderWidth: 1,
              borderColor: getODSColor(primeiraTema, false),
            }}
          >
            {primeiraTema}
          </Text>
        ) : category ? (
          <Text
            style={{
              borderRadius: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              fontSize: 12,
              fontWeight: '500',
              backgroundColor: getODSColor(category, true),
              color: getODSColor(category, false),
              borderWidth: 1,
              borderColor: getODSColor(category, false),
            }}
          >
            {category}
          </Text>
        ) : null}

        {/* ← ALTERADO: Badge de ODS agora mostra o NOME em vez de "ODS 9" */}
        {primeiroOds ? (() => {
          const odsInfo = getODSByNumber(primeiroOds);
          return (
            <Text
              style={{
                borderRadius: 4,
                paddingHorizontal: 8,
                paddingVertical: 4,
                fontSize: 12,
                fontWeight: '500',
                backgroundColor: getODSColorByNumber(primeiroOds, true),
                color: getODSColorByNumber(primeiroOds, false),
                borderWidth: 1,
                borderColor: getODSColorByNumber(primeiroOds, false),
              }}
            >
              {odsInfo ? odsInfo.name : `ODS ${primeiroOds}`}
            </Text>
          );
        })() : null}
      </View>
    </Pressable>
  );
}