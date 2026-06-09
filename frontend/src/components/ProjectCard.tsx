import { Bookmark, Calendar, TrendingUp } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { getODSColor, getODSColorByNumber } from '@/data/odsMapping';
import { useTheme } from '@/hooks/useTheme';
import type { ProjectStatus } from '@/types/project';

import { StatusBadge } from './StatusBadge';

interface ProjectCardProps {
  id: string;
  title: string;
  year: string;
  status: ProjectStatus;
  trending?: boolean;
  category: string;
  ementa?: string;
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
  year,
  status,
  trending,
  category,
  ementa,
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

      {/* Título */}
      <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: '600', lineHeight: 22, color: colors.text }}>
        {title}
      </Text>

      {/* Ementa truncada — F1 */}
      {ementa ? (
        <Text style={{ marginBottom: 10, fontSize: 13, lineHeight: 19, color: colors.textMuted }}>
          {truncate(ementa)}
        </Text>
      ) : null}

      {/* Linha inferior: ano + tema + ODS */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Calendar size={14} color={colors.textMuted} />
          <Text style={{ fontSize: 14, color: colors.textMuted }}>{year}</Text>
        </View>

        {/* Badge de tema — B3 */}
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

        {/* Badge de ODS — B2 */}
        {primeiroOds ? (
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
            ODS {primeiroOds}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}