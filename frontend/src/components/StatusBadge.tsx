import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import type { ProjectStatus } from '@/types/project';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const { colors } = useTheme();

  const statusConfig: Record<
    ProjectStatus,
    { label: string; color: string; bg: string; tooltip: string }
  > = {
    active: {
      label: 'Em tramitação',
      color: colors.badgeTramitacaoText,
      bg: colors.badgeTramitacaoBg,
      tooltip: 'O projeto está em processo de análise e tramitação nas comissões',
    },
    pending: {
      label: 'Aguardando votação',
      color: colors.badgeAguardandoText,
      bg: colors.badgeAguardandoBg,
      tooltip: 'O projeto foi aprovado nas comissões e aguarda votação no plenário',
    },
    archived: {
      label: 'Arquivado',
      color: colors.tagDefaultText,
      bg: colors.tagDefaultBg,
      tooltip: 'O projeto foi arquivado ou rejeitado',
    },
    approved: {
      label: 'Projeto aprovado',
      color: colors.badgeAprovadoText,
      bg: colors.badgeAprovadoBg,
      tooltip: 'O projeto foi aprovado e segue para sanção ou promulgação',
    },
  };

  const config = statusConfig[status] ?? statusConfig.pending;

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        onPress={() => setShowTooltip((v) => !v)}
        accessibilityRole="button"
        accessibilityLabel={config.label}
        accessibilityHint="Toque para ver a descrição do status"
      >
        <Text
          style={{
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            paddingHorizontal: size === 'sm' ? 10 : 12,
            paddingVertical: size === 'sm' ? 4 : 6,
            fontSize: size === 'sm' ? 11 : 13,
            fontWeight: '600',
            borderRadius: 4,
            backgroundColor: config.bg,
            color: config.color,
          }}
        >
          {config.label}
        </Text>
      </Pressable>

      {showTooltip && (
        <Pressable
          onPress={() => setShowTooltip(false)}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            zIndex: 50,
            marginBottom: 8,
            maxWidth: 280,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          accessibilityRole="alert"
        >
          <Text style={{ textAlign: 'center', fontSize: 13, lineHeight: 18, color: colors.text }}>
            {config.tooltip}
          </Text>
        </Pressable>
      )}
    </View>
  );
}