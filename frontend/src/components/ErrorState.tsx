import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Não foi possível carregar os dados.', onRetry }: ErrorStateProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        paddingHorizontal: 32,
        backgroundColor: colors.background,
      }}
    >
      <Text style={{ fontSize: 40 }}>⚠️</Text>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
        Algo deu errado
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={{
            marginTop: 8,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
            backgroundColor: colors.primary,
          }}
        >
          <Text style={{ color: colors.textInverse, fontWeight: '600', fontSize: 14 }}>
            Tentar novamente
          </Text>
        </Pressable>
      )}
    </View>
  );
}