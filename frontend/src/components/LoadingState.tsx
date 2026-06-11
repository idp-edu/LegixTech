import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.textMuted, fontSize: 14 }}>{message}</Text>
    </View>
  );
}