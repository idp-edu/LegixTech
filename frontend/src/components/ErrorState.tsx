import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ErrorStateProps {
  message?: unknown; // aceita unknown para ser resiliente a erros de tipagem
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();

  // Guard defensivo: normaliza qualquer tipo para string segura
  const safeMessage =
    typeof message === 'string' && message.length > 0
      ? message
      : 'Não foi possível carregar os dados.';

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
        {safeMessage}
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