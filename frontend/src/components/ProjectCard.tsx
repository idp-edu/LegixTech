import { Bookmark, Calendar, TrendingUp } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { getODSColor } from '@/data/odsMapping';
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
  onSave?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function ProjectCard({
  id,
  title,
  year,
  status,
  trending,
  category,
  saved,
  onSave,
  onClick,
}: ProjectCardProps) {
  return (
    <Pressable
      onPress={() => onClick?.(id)}
      className="rounded-lg border border-border bg-card p-4 active:opacity-90"
    >
      <View className="mb-3 flex-row items-start justify-between gap-3">
        <View className="flex-row flex-wrap items-center gap-2">
          <StatusBadge status={status} size="sm" />
          {trending && (
            <View className="flex-row items-center gap-1 rounded px-2 py-1" style={{ backgroundColor: '#fee2e2' }}>
              <TrendingUp size={12} color="#ef4444" />
              <Text className="text-xs font-medium" style={{ color: '#ef4444' }}>
                Em Alta
              </Text>
            </View>
          )}
        </View>
        <Pressable
          onPress={(e) => {
            e?.stopPropagation?.();
            onSave?.(id);
          }}
          className="min-h-11 min-w-11 items-center justify-center -mr-2 -mt-2"
          hitSlop={8}
        >
          <Bookmark size={20} color={saved ? '#1e40af' : '#6b7280'} fill={saved ? '#1e40af' : 'transparent'} />
        </Pressable>
      </View>

      <Text className="mb-2 font-display text-base font-semibold leading-snug text-foreground">{title}</Text>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <Calendar size={14} color="#6b7280" />
          <Text className="text-sm text-muted-foreground">{year}</Text>
        </View>
        <Text
          className="rounded px-2 py-1 text-xs font-medium"
          style={{
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
