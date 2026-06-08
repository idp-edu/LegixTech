import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ProjectStatus } from '@/types/project';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; tooltip: string }
> = {
  active: {
    label: 'Em tramitação',
    color: '#1e40af',
    bg: '#dbeafe',
    tooltip: 'O projeto está em processo de análise e tramitação nas comissões',
  },
  pending: {
    label: 'Aguardando votação',
    color: '#ea580c',
    bg: '#fed7aa',
    tooltip: 'O projeto foi aprovado nas comissões e aguarda votação no plenário',
  },
  archived: {
    label: 'Arquivado',
    color: '#374151',
    bg: '#e5e7eb',
    tooltip: 'O projeto foi arquivado ou rejeitado',
  },
  approved: {
    label: 'Projeto aprovado',
    color: '#15803d',
    bg: '#dcfce7',
    tooltip: 'O projeto foi aprovado e segue para sanção ou promulgação',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const config = statusConfig[status] ?? statusConfig.pending;

  return (
    <View className="relative">
      <Pressable
        onPress={() => setShowTooltip((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={config.label}
        accessibilityHint="Toque para ver a descrição do status"
      >
        <Text
          className={`uppercase tracking-wider ${size === 'sm' ? 'text-xs px-2.5 py-1' : 'text-sm px-3 py-1.5'}`}
          style={{
            backgroundColor: config.bg,
            color: config.color,
            fontWeight: '600',
            borderRadius: 4,
          }}
        >
          {config.label}
        </Text>
      </Pressable>

      {showTooltip && (
        <Pressable
          onPress={() => setShowTooltip(false)}
          className="absolute bottom-full left-0 z-50 mb-2 max-w-xs rounded-lg border border-border bg-card px-3 py-2 shadow-lg"
          accessibilityRole="alert"
        >
          <Text className="text-center text-[13px] leading-snug text-foreground">{config.tooltip}</Text>
        </Pressable>
      )}
    </View>
  );
}