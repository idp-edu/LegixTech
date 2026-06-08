import { Bookmark, Calendar, TrendingUp } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { getODSColor } from '@/data/odsMapping';
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
  saved?: boolean;
  canSave?: boolean;
  onSave?: (id: string) => void;
  onClick?: (id: string) => void;
  onRequireAuth?: () => void;
}

export function ProjectCard({
  id,
  title,
  year,
  status,
  trending,
  category,
  saved,
  canSave = true,
  onSave,
  onClick,
  onRequireAuth,
}: ProjectCardProps) {
  const { colors } = useTheme();

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

      <Text style={{ marginBottom: 8, fontSize: 16, fontWeight: '600', lineHeight: 22, color: colors.text }}>
        {title}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Calendar size={14} color={colors.textMuted} />
          <Text style={{ fontSize: 14, color: colors.textMuted }}>{year}</Text>
        </View>
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
      </View>
    </Pressable>
  );
}